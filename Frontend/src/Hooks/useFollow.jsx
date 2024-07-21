import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import toast from "react-hot-toast"


const useFollow = () => {
      
    const queryClient=useQueryClient()
    const { mutate: Follow, isPending, isLoading } = useMutation({
        mutationFn: async (userId) => {
               try {
                   const res = await fetch(`/api/users/follow/${userId}`, {
                       method:"POST"
                   })
                   const data = await res.json()
                   if (!res.ok) {
                        throw new Error(data.error || "Something Went Wrong")
                   }
                     return data
               } catch (error) {
                   throw new Error(error)
               }
        },
         
        onSuccess: () => {

            Promise.all([
            queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
            queryClient.invalidateQueries({ queryKey: ["authUser"] }),
            
        ])
     
    },
        onError: (error) => {
            toast.error(error.message)
        }
        
    })

  return {Follow,isPending}

}

export default useFollow
