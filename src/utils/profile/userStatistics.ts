import { supabase } from '../global/supabase';
import type { UserStatistics } from '../types/profile';

/**
 * Gets user statistics
 * @returns { UserStatistics | null } User statistics
 */
export async function getUserStatistics(): Promise<UserStatistics | null> {
    const { data, error } = await supabase.rpc('get_user_statistics');

    if (error || !data) {
        return null;
    } else {
        return {
            recipesCreated: data[0].recipes_created,
            averageRating: data[0].average_rating,
            neverCooked: data[0].never_cooked,
        };
    }
}
