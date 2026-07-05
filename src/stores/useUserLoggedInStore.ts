import { supabase } from '@/utils/global/supabase';
import { ref } from 'vue';

export const isLoggedIn = ref<boolean>(false);

supabase.auth.onAuthStateChange((event, session) => {
  isLoggedIn.value = !!session
});
