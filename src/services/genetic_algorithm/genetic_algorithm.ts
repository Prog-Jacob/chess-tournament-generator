import { RoundRobinFormat, SwissFormat } from "../../types/formats";
import { isRobin, isSwiss } from "../../utils/tournament_types_map";
import RoundRobinGenerator from "../tournament/generators/round_robin";
import SingleEliminationGenerator from "../tournament/generators/single_elimination_round";
import SwissGenerator from "../tournament/generators/swiss";
import { generateSamples } from "./first_generation";
import { Tournament as TournamentType } from "./first_generation";
import Tournament from "../tournament";
import { PlayerProfile } from "../../types/player";
import UniversalManager from "../tournament/managers/universal_manager";
import Player from "../player";

export interface Sample {
    formats: TournamentType;
    rounds: Map<number, [number, number]>;
}

class GeneticAlgorithm {
    private players: PlayerProfile[];
    private playersRanked: Map<PlayerProfile, number>;
    private generationSize: number;
    private mode: string;
    private numberOfRounds: number;
    private generation: Set<Sample>;
    private fittest: Sample[] = [];

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

        this.mode = mode;
        this.generationSize = generationSize;
        this.numberOfRounds = numberOfRounds;
        this.playersRanked = new Map(
            this.players.map((player, index) => [player, index])
        );
        this.generation = new Set();
    }

    private selectFittest() {
        const fittest: [Sample, number][] = [];

        for (const { formats, rounds } of this.generation) {
            const tournament = new Tournament(
                this.players.map((p) => ({ ...p })),
                formats
            );
            const result = tournament.getTournamentResult();
            const fitness = result.reduce(
                (acc, player, index) =>
                    acc + (index - this.playersRanked.get(player)!) ** 2,
                0
            );
            fittest.push([{ formats, rounds }, fitness]);
        }

        this.fittest = fittest
            .sort(
                (a, b) =>
                    a[1] - b[1] || a[0].formats.length - b[0].formats.length
            )
            .slice(0, this.generationSize)
            .map((x) => x[0]);
    }

    private crossover() {
        const generation = [...this.fittest];
        const newGeneration: Map<Sample, number> = new Map();

        for (let i = 0; i < generation.length; i++) {
            const { formats, rounds } = generation[i];

            for (let j = i + 1; j < generation.length; j++) {
                const { formats: formats2, rounds: rounds2 } = generation[j];

                for (const [round, [idx, players]] of rounds) {
                    if (!rounds2.has(round)) continue;
                    const [idx2, players2] = rounds2.get(round)!;

                    if (players == players2) {
                        const newFormat = [
                            ...formats.slice(0, idx),
                            ...formats2.slice(idx2),
                        ];
                        const newRounds = this.preprocessFormats(
                            newFormat,
                            this.players.length
                        );
                        const minIdx = Math.min(
                            i + j,
                            newGeneration.get(newRounds) || Infinity
                        );
                        newGeneration.set(newRounds, minIdx);
                    }
                }
            }

            this.generation = new Set(
                Array.from(newGeneration)
                    .sort((a, b) => b[1] - a[1])
                    .slice(-this.generationSize)
                    .map((x) => x[0])
            );
        }
    }

    public advanceGenerationBy(generation: number) {
        for (let i = 0; i < generation; i++) {
            while (this.generation.size < this.generationSize) {
                generateSamples(
                    this.generationSize - this.generation.size,
                    this.players.length,
                    this.numberOfRounds
                ).forEach((tournament) =>
                    this.generation.add(
                        this.preprocessFormats(tournament, this.players.length)
                    )
                );
            }
            this.crossover();
            this.selectFittest();
        }
    }

    public getFormat(): TournamentType {
        return this.fittest[0]?.formats || [];
    }

    public getTournamentResults(): Player[] {
        const tournament = new Tournament(
            this.players.map((p) => ({ ...p })),
            this.getFormat()
        );
        return tournament.getTournamentResult().map((p) => p.player);
    }

    private preprocessFormats(
        formats: TournamentType,
        players: number
    ): Sample {
        let round = 0;
        let nextPlayers;
        const rounds = new Map<number, [number, number]>();

        for (let i = 0; i < formats.length - 1; i++) {
            if (isRobin(formats[i])) {
                round += RoundRobinGenerator.getNumberOfRounds(
                    formats[i] as RoundRobinFormat
                );
                nextPlayers = RoundRobinGenerator.getNumberOfPlayers(
                    formats[i] as RoundRobinFormat
                );
            } else if (isSwiss(formats[i])) {
                round += SwissGenerator.getNumberOfRounds(
                    formats[i] as SwissFormat
                );
                nextPlayers = SwissGenerator.getNumberOfPlayers(
                    formats[i] as SwissFormat
                );
            } else {
                round += SingleEliminationGenerator.getNumberOfRounds(
                    formats[i]
                );
                nextPlayers = SingleEliminationGenerator.getNumberOfPlayers(
                    formats[i],
                    players
                );
            }
            if (round > this.numberOfRounds || nextPlayers >= players) {
                return { formats: [], rounds: new Map() };
            }
            players = nextPlayers;
            rounds.set(round, [i + 1, players]);
        }

        return { formats, rounds };
    }
}

export default GeneticAlgorithm;
