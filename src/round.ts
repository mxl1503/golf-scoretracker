import { PlayerHoleScore, Round } from './models/modelTypes';
import {
  UserSchema,
} from './models/user';
import HTTPError from 'http-errors';
import {
  shotsTakenHelper,
} from './helperFunctions';

// interface RoundSimplifiedInterface {
//   course: string;
//   roundId: number;
//   players: string[];
//   shotsTaken: number[];
// }

// interface RoundsListInterface {
//   round: RoundSimplifiedInterface[];
// }

interface RoundsListInterface {
  course: string;
  roundId: number;
  players: string[];
  shotsTaken: number[];
}

/**
 * Use a user Id and return a list of their previously played rounds with select 
 * infomation displayed.
 * 
 * @param userId 
 * @returns 
 */
export async function getRoundsList(userId: number): Promise<RoundsListInterface[]> {
  try {
    const existingUser = await UserSchema.find({ userId: userId });
    if (existingUser.length === 0) {
      throw HTTPError(400, 'No such user exists');
    }

    const userObject = existingUser[0];
    const returnObject: RoundsListInterface[] = userObject.previousRounds.map((round) => ({
      course: round.course,
      roundId: round.roundId,
      players: round.players,
      shotsTaken: shotsTakenHelper(round as Round),
    }));

    return returnObject;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
