import UniversalManager from "../tournament/managers/universal_manager";
import { Generator } from "../tournament/generators/generator";
import { isRobin } from "../../utils/tournament_types_map";
import { Format, SwissFormat } from "../../types/formats";
import { generateSamples } from "./first_generation";
import { TournamentType } from "./first_generation";
import { PlayerProfile } from "../../types/player";
import Tournament from "../tournament";
import Player from "../player";

export interface Sample {
    formats: TournamentType;
    rounds: Map<number, [number, number]>;
}

class GeneticAlgorithm {
    private generation: Map<string, number> = new Map();
    private fittest: TournamentType = [];
    private progress: number[] = [];

    private playersRanks: Map<number, number>;
    private players: PlayerProfile[];
    private numberOfRounds: number;
    private generationSize: number;

    constructor(
        players: PlayerProfile[],
        generationSize: number,
        numberOfRounds: number,
        mode: string
    ) {
        globalThis.universalManager = new UniversalManager(players);
        this.players = [...players].sort((a, b) =>
            mode == "Fair"
                ? b.player.invCDF(0.5) - a.player.invCDF(0.5)
                : a.player.invCDF(0.5) - b.player.invCDF(0.5)
        );
        this.playersRanks = new Map(
            this.players.map((player, rank) => [player.id, rank])
        );
        this.generationSize = generationSize;
        this.numberOfRounds = numberOfRounds;
    }

    private selectFittest() {
        const fittest: Map<string, number> = new Map();

        for (const tournamentStr of this.generation) {
            const tournament = this.parse(tournamentStr[0]).formats;

            const manager = new Tournament(
                this.players.map((p) => ({ ...p })),
                tournament
            );

            const fitness =
                (manager
                    .getTournamentResult()
                    .reduce(
                        (errAccumlator, player, rank) =>
                            errAccumlator +
                            (rank - this.playersRanks.get(player.id)!) ** 2,
                        0
                    ) /
                    this.players.length) **
                0.5;
            fittest.set(tournamentStr[0], fitness);
        }

        const fittestSample = [...fittest].reduce((acc, curr) =>
            acc[1] < curr[1] ? acc : curr
        );
        this.progress.push(fittestSample[1]);
        this.generation = fittest;
        this.fittest = this.parse(fittestSample[0]).formats;
    }

    private drawRouletteWheel(costs: number[]): number {
        const totalCost = costs[costs.length - 1];
        const random = Math.random() * totalCost;
        let r = costs.length;
        let l = 0;

        while (l < r) {
            const m = (l + r) >> 1;
            if (random < costs[m]) {
                if (r == m)
                    throw new Error(
                        `Invalid roulette wheel ${costs} and ${random}`
                    );
                r = m;
            } else {
                l = m + 1;
            }
        }

        if (l == costs.length) {
            throw new Error(
                `Invalid roulette wheel ${costs} and ${random} and ${l}`
            );
        }
        return l;
    }

    private crossover() {
        const generation: Sample[] = [...this.generation].map((x) =>
            this.parse(x[0])
        );
        const generationStr: string[] = [...this.generation].map((x) => x[0]);

        let totalCost = 0;
        const highestCost = [...this.generation].reduce(
            (acc, curr) => Math.max(acc, curr[1]),
            0
        );
        const costs = [...this.generation].map(
            (sample) => (totalCost += highestCost - sample[1])
        );
        const newGeneration: Map<string, number> = new Map();

        const mixChromosomesAndAddToGeneration = (
            firstHalf: TournamentType,
            qualifiers: number,
            round: number,
            i: number
        ) => {
            const idx = generation[i].rounds.get(round)![0];
            const formats = generation[i].formats.slice(idx);
            const secondHalf = this.mixChromosomes(
                formats,
                qualifiers
            ) as TournamentType;
            const tournament = this.preprocessFormats([
                ...firstHalf,
                ...secondHalf,
            ]);
            if (tournament.formats.length == 0) {
                return;
            }
            addToGeneration(this.stringify(tournament));
        };

        const addToGeneration = (tournamentStr: string) => {
            if (newGeneration.has(tournamentStr)) return;
            newGeneration.set(tournamentStr, 0);
        };

        const isGenerationFull = () => {
            return newGeneration.size < this.generationSize;
        };

        while (isGenerationFull()) {
            const i = this.drawRouletteWheel(costs);
            const j = this.drawRouletteWheel(costs);
            const { formats, rounds } = generation[i];
            const { formats: formats2, rounds: rounds2 } = generation[j];
            const potentialRounds = [...rounds.entries()].filter((x) =>
                rounds2.has(x[0])
            );
            if (potentialRounds.length == 0) continue;
            if (formats.length == 1) {
                addToGeneration(generationStr[i]);
            }

            const [round, [idx, players]] =
                potentialRounds[
                    Math.floor(Math.random() * potentialRounds.length)
                ];
            const [idx2, players2] = rounds2.get(round)!;

            if (players >= players2) {
                mixChromosomesAndAddToGeneration(
                    formats.slice(0, idx),
                    players,
                    round,
                    j
                );
            }
            if (players <= players2) {
                mixChromosomesAndAddToGeneration(
                    formats2.slice(0, idx2),
                    players2,
                    round,
                    i
                );
            }
        }

        this.generation = newGeneration;
    }

    public advanceGenerationBy(generation: number) {
        for (let i = 0; i < generation; i++) {
            while (this.generation.size < this.generationSize) {
                generateSamples(
                    this.generationSize - this.generation.size,
                    this.players.length,
                    this.numberOfRounds
                )
                    .map((formats) => this.preprocessFormats(formats))
                    .filter((tournament) => tournament.formats.length)
                    .forEach((tournament) =>
                        this.generation.set(this.stringify(tournament), 0)
                    );
            }
            this.selectFittest();
            this.crossover();
            this.reinsertion();
        }
    }

    private mixChromosomes(
        formats: TournamentType,
        qualifiers: number
    ): TournamentType {
        const tournament: TournamentType = [];

        for (const format of formats) {
            let newFormat: Format;

            if (!isRobin(format) || qualifiers - format.matches <= 1) {
                newFormat = format;
            } else {
                newFormat = {
                    matches: Generator.getNumberOfRounds(format),
                    topCut: format.topCut,
                } as SwissFormat;
            }

            qualifiers = Generator.getNumberOfPlayers(newFormat, qualifiers);
            tournament.push(newFormat);
        }

        return tournament;
    }

    private reinsertion() {
        // const generation = [...this.generation]
        //     .map((x) => this.parse(x))
        //     .slice(0, 5);

        // for (const { formats, rounds } of generation) {
        //     if (rounds.size == 0) continue;
        //     const i = Math.floor(Math.random() * rounds.size);
        //     const [round, [idx, players]] = [...rounds.entries()][i];

        //     const tournament = this.preprocessFormats([
        //         ...formats.slice(0, idx),
        //         ...(generateSamples(
        //             1,
        //             players,
        //             this.numberOfRounds - round
        //         )[0] ?? []),
        //     ]);
        //     if (tournament.formats.length == 0) continue;
        //     this.generation.add(this.stringify(tournament));
        // }

        generateSamples(10, this.players.length, this.numberOfRounds)
            .slice(5)
            .forEach((sample) =>
                this.generation.set(
                    this.stringify(this.preprocessFormats(sample)),
                    0
                )
            );
    }

    public getProgress(): number[] {
        return this.progress;
    }

    public getFormat(): TournamentType {
        return this.fittest;
    }

    public getTournamentResults(): Player[] {
        const tournament = new Tournament(
            this.players.map((p) => ({ ...p })),
            this.getFormat()
        );
        return tournament.getTournamentResult().map((p) => p.player);
    }

    private preprocessFormats(formats: TournamentType): Sample {
        let round = 0;
        let nextPlayers;
        let players = this.players.length;
        const rounds = new Map<number, [number, number]>();

        for (let i = 0; i < formats.length; i++) {
            round += Generator.getNumberOfRounds(formats[i]);
            nextPlayers = Generator.getNumberOfPlayers(formats[i], players);

            if (round > this.numberOfRounds || nextPlayers >= players) {
                return { formats: [], rounds: new Map() };
            } else if (i < formats.length - 1) {
                rounds.set(round, [i + 1, nextPlayers]);
            }

            players = nextPlayers;
        }

        return round == this.numberOfRounds
            ? { formats, rounds }
            : { formats: [], rounds: new Map() };
    }

    private stringify(tournament: Sample): string {
        return JSON.stringify({
            formats: tournament.formats,
            rounds: [...tournament.rounds.entries()],
        });
    }

    private parse(tournament: string): Sample {
        const { formats, rounds } = JSON.parse(tournament);
        return { formats, rounds: new Map(rounds) };
    }
}

export default GeneticAlgorithm;
