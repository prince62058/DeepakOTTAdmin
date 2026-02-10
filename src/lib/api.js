// src/lib/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
      if (token) {
        headers.set('Authorization', `${token}`)
      }

      return headers
    },
  }), // adjust baseUrl
  tagTypes: ['user', 'userDetails', 'subAdmin', 'language', 'subscription', 'company', 'faq', 'transaction', 'genre', 'movie'], // example tag type
  endpoints: (builder) => ({
    // admi login
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `/admin/login`,
        method: 'POST',
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: ({ data }) => ({
        url: `/updateProfile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['user', 'userDetails'],
    }),

    // user
    getUser: builder.query({
      query: ({ page, search, disable, userType }) => `/admin/users?page=${page}&search=${search}&disable=${disable}&userType=${userType}`,
      providesTags: ['user'],
    }),
    getUserProfile: builder.query({
      query: ({ userId }) => `/profile/${userId}`,
      providesTags: ['userDetails'],
    }),
    getUserDetails: builder.query({
      query: ({ userId }) => `/admin/users/${userId}`,
    }),
    disableUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/disable`,
        method: 'PATCH',
      }),
      invalidatesTags: ['user'],
    }),

    // sub admin
    createSubAdmin: builder.mutation({
      query: (data) => ({
        url: `/createSubAdmin`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),

    // language
    getLanguage: builder.query({
      query: ({ page, search, disable }) => `/getLanguages?page=${page}&search=${search}&disable=${disable}`,
      providesTags: ['language'],
    }),
    createLanguage: builder.mutation({
      query: (data) => ({
        url: `/admin/createLanguage`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['language'],
    }),
    updateLanguage: builder.mutation({
      query: ({ data, languageId }) => ({
        url: `/admin/languages/${languageId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['language'],
    }),

    // Subscription
    getSubscription: builder.query({
      query: ({ page, search, disable }) => `/getAllSubscription?page=${page}&search=${search}&disable=${disable}`,
      providesTags: ['subscription'],
    }),
    createSubscription: builder.mutation({
      query: (data) => ({
        url: `/admin/createSubscription`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['subscription'],
    }),
    updateSubscription: builder.mutation({
      query: (data) => ({
        url: `/admin/updateSubscription`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['subscription'],
    }),
    disableSubcription: builder.mutation({
      query: (data) => ({
        url: `/admin/disableSubscription`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['subscription'],
    }),
    deleteSubscription: builder.mutation({
      query: (data) => ({
        url: `/admin/deleteSubscription`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['subscription'],
    }),

    // genre
    getGenre: builder.query({
      query: ({ page, search, disable }) => `/getGenre?page=${page}&search=${search}&disable=${disable}`,
      providesTags: ['genre'],
    }),
    createGenre: builder.mutation({
      query: (data) => ({
        url: `/admin/genres`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['genre'],
    }),
    updateGenre: builder.mutation({
      query: ({ data, genreId }) => ({
        url: `/admin/genres/${genreId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['genre'],
    }),
    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `/admin/genres/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['genre'],
    }),

    // movie
    getMovie: builder.query({
      query: ({ page, search, disable }) => `/getAllByFilterMovieSeries?page=${page}&search=${search}&disable=${disable}`,
      providesTags: ['movie'],
    }),
    createMovie: builder.mutation({
      query: (data) => ({
        url: `/admin/createMovieOrWebSeries`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['movie'],
    }),
    updateMovie: builder.mutation({
      query: ({ data }) => ({
        url: `/admin/updateMovieOrWebSeries`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['movie'],
    }),
    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `/admin/deleteMovieOrWebSeries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['movie'],
    }),

    // faq
    getFaq: builder.query({
      query: ({ page, search }) => `/admin/getAllFAQ?page=${page}&search=${search}`,
      providesTags: ['faq'],
    }),
    createFaq: builder.mutation({
      query: (data) => ({
        url: `/createFAQ`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['faq'],
    }),
    updateFaq: builder.mutation({
      query: (data) => ({
        url: `/admin/updateFAQ`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['faq'],
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/admin/deleteFaq?faqId=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['faq'],
    }),

    // notification
    sendNotification: builder.mutation({
      query: (data) => ({
        url: `/admin/sendNotification`,
        method: 'POST',
        body: data,
      }),
    }),

    // transaction
    getTransaction: builder.query({
      query: ({ page, search, Type }) => `/getListTransactionByUserId?page=${page}&search=${search}&Type=${Type}`,
      providesTags: ['transaction'],
    }),
    updateTransaction: builder.mutation({
      query: ({ data, transectionId }) => ({
        url: `/admin/updateTransactionStatus?transectionId=${transectionId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['transaction'],
    }),
    clearAllTransactions: builder.mutation({
      query: () => ({
        url: `/admin/clearAllTransactions`,
        method: 'DELETE',
      }),
      invalidatesTags: ['transaction'],
    }),

    // company
    getCompany: builder.query({
      query: () => `/getCompany`,
      providesTags: ['company'],
    }),
    updateCompany: builder.mutation({
      query: ({ data, companyId }) => ({
        url: `/admin/updateCompany?companyId=${companyId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['company'],
    }),

    // image and movie upload
    uploadImage: builder.mutation({
      query: (data) => ({
        url: `/imageToUrl`,
        method: 'POST',
        body: data,
      }),
    }),
    uploadMovie: builder.mutation({
      query: (data) => ({
        url: `/uploadMovie`,
        method: 'POST',
        body: data,
      }),
    }),

    // dashboard
    getDashboard: builder.query({
      query: ({ startDate, endDate }) => `/admin/dashboard?startDate=${startDate}&endDate=${endDate}`,
    }),
  }),
})

// auto-generated hooks
export const {
  useAdminLoginMutation,
  useUpdateProfileMutation,
  useCreateSubAdminMutation,
  useGetUserQuery,
  useGetUserProfileQuery,
  useGetUserDetailsQuery,
  useDisableUserMutation,
  useGetLanguageQuery,
  useCreateLanguageMutation,
  useUpdateLanguageMutation,
  useGetGenreQuery,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
  useGetMovieQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useGetSubscriptionQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDisableSubcriptionMutation,
  useDeleteSubscriptionMutation,
  useGetFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
  useGetTransactionQuery,
  useUpdateTransactionMutation,
  useClearAllTransactionsMutation,
  useSendNotificationMutation,
  useUploadImageMutation,
  useUploadMovieMutation,
  useGetDashboardQuery,
} = api
