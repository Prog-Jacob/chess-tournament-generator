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

export interface Sample {
    formats: TournamentType;
    rounds: Map<number, [number, number]>;
}

class GeneticAlgorithm {
    private players: PlayerProfile[];
    private playersRanked: Map<PlayerProfile, number>;
    private generationSize: number;
    private mode: string;
    private tournaments: TournamentType[];
    private generation: Sample[];

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
        this.tournaments = generateSamples(
            generationSize,
            players.length,
            numberOfRounds
        );
        this.generation = this.tournaments.map((tournament) =>
            this.preprocessFormats(tournament, players.length)
        );
        this.playersRanked = new Map(
            this.players.map((player, index) => [player, index])
        );
        this.selectFittest();
        console.log("Initialized genetic algorithm");
    }

    private selectFittest() {
        const fittest: [Sample, number][] = [];

        for (const { formats, rounds } of this.generation) {
            const tournament = new Tournament(this.players, formats);
            const result = tournament.getTournamentResult();
            const fitness = result.reduce(
                (acc, player, index) =>
                    acc + (index - this.playersRanked.get(player)!) ** 2,
                0
            );
            fittest.push([{ formats, rounds }, fitness]);
        }

        this.generation = fittest
            .sort((a, b) => b[1] - a[1])
            .map((x) => x[0])
            .slice(-this.generationSize);
    }

    private crossover() {
        const newGeneration: [Sample, number][] = [];

        for (let i = 0; i < this.generation.length; i++) {
            const { formats, rounds } = this.generation[i];
            for (let j = i + 1; j < this.generation.length; j++) {
                const { formats: formats2, rounds: rounds2 } =
                    this.generation[j];
                for (const [round, [idx, players]] of rounds) {
                    if (!rounds2.has(round)) continue;
                    const [idx2, players2] = rounds2.get(round)!;
                    if (players >= players2) {
                        const newFormat = [
                            ...formats.slice(0, idx),
                            ...formats2.slice(idx2),
                        ];
                        const newRounds = this.preprocessFormats(
                            newFormat,
                            this.players.length
                        );
                        newGeneration.push([newRounds, i + j]);
                    }
                    if (players <= players2) {
                        const newFormat = [
                            ...formats.slice(idx),
                            ...formats2.slice(0, idx2),
                        ];
                        const newRounds = this.preprocessFormats(
                            newFormat,
                            this.players.length
                        );
                        newGeneration.push([newRounds, i + j]);
                    }
                }
            }

            this.generation = newGeneration
                .sort((a, b) => a[1] - b[1])
                .map((x) => x[0])
                .slice(-this.generationSize);
        }
    }

    public advanceGenerationBy(generation: number) {
        console.log(this.generation.length);
        for (let i = 0; i < generation; i++) {
            // this.crossover();
            this.selectFittest();
            console.log(this.generation.length);
        }
    }

    public getFormat(): TournamentType {
        return this.generation[0].formats;
    }

    private preprocessFormats(
        formats: TournamentType,
        players: number
    ): Sample {
        let round = 0;
        const rounds = new Map<number, [number, number]>();

        for (let i = 0; i < formats.length - 1; i++) {
            if (isRobin(formats[i])) {
                round += RoundRobinGenerator.getNumberOfRounds(
                    formats[i] as RoundRobinFormat
                );
                players -= RoundRobinGenerator.getNumberOfPlayers(
                    formats[i] as RoundRobinFormat
                );
            } else if (isSwiss(formats[i])) {
                round += SwissGenerator.getNumberOfRounds(
                    formats[i] as SwissFormat
                );
                players -= SwissGenerator.getNumberOfPlayers(
                    formats[i] as SwissFormat
                );
            } else {
                round += SingleEliminationGenerator.getNumberOfRounds(
                    formats[i]
                );
                players -= SingleEliminationGenerator.getNumberOfPlayers(
                    formats[i],
                    players
                );
            }

            rounds.set(round, [i + 1, players]);
        }

        return { formats, rounds };
    }
}

export default GeneticAlgorithm;
