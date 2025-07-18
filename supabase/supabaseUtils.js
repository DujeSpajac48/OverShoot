
import { supabase } from "./supabase";
console.log('Supabase klijent:', supabase);



export async function signUp(email, password, extra = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: extra, 
    },
  });
  if (error) {
    console.log('Error signUp:', error);
    const isDuplicate = /registered|exists|duplicate|already/i.test(error.message ?? '');
    return {
      error: isDuplicate ? 'This email is already registered.' : error.message,
    };
  }
  return {data };
}




export async function signIn(email,password){
   const { data, error}  = await supabase.auth.signInWithPassword({
      email : email,
      password : password,
   });

   if (error){
      console.log("Error signIn: " , error);
      return {error : error.message};
   }
   console.log("Login data: ",data);
return { data};
}


export async function getCurrentUser() {
   const { data} = await supabase.auth.getUser();
   return data.user;
 }
 

 export async function signOut(){
      const { error } = await supabase.auth.signOut();
      if (error) {
         console.log("LOGOUT ERROR: " , error);
      }
 }

export async function resetPassword(email) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.log('Error resetPassword:', error);
      return { error: error.message };
    }

    return {data};
  } catch (err) {
    console.log('Unexpected error resetPassword:', err);
    return { error: 'Unexpected error. Try again.' };
  }
}
