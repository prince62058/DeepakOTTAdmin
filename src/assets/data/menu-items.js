const AllRoutes = [
  {
    key: 'general',
    label: 'GENERAL',
    isTitle: true,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-5-bold-duotone',
    url: '/dashboard',
  },
  {
    key: 'language',
    label: 'Language',
    icon: 'mdi:translate',
    url: '/language/language-list',
    permission: 'Language',
  },
  {
    key: 'user',
    label: 'User',
    icon: 'solar:users-group-two-rounded-bold-duotone',
    url: '/user/user-list',
    permission: 'User',
  },
  {
    key: 'notification',
    label: 'Notification',
    icon: 'solar:bell-bold-duotone',
    url: '/notification',
    permission: 'Notification',
  },
  {
    key: 'subAdmin',
    label: 'Sub Admin',
    icon: 'solar:shield-user-line-duotone',
    url: '/subAdmin/subAdmin-list',
    permission: 'SubAdmin',
  },
  {
    key: 'genre',
    label: 'Genre',
    icon: 'solar:document-text-line-duotone',
    url: '/genre/genre-list',
    permission: 'Genre',
  },
  {
    key: 'movie',
    label: 'Movie',
    icon: 'solar:clapperboard-open-play-line-duotone',
    url: '/movie/movie-list',
    permission: 'Movie',
  },
  {
    key: 'subscription',
    label: 'Subscription',
    icon: 'solar:cloud-sun-line-duotone',
    url: '/subscription/subscription-list',
    permission: 'Subscription',
  },
  {
    key: 'transaction',
    label: 'Transaction',
    icon: 'solar:file-download-line-duotone',
    url: '/transaction',
    permission: 'Transaction',
  },
  {
    key: 'faq',
    label: 'Faq',
    icon: 'solar:question-circle-bold-duotone',
    url: '/faq/faq-list',
    permission: 'Faq',
  },
  {
    key: 'company',
    label: 'Company',
    icon: 'solar:settings-bold-duotone',
    url: '/company',
    permission: 'Company',
  },
]
const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null

export const MENU_ITEMS = userData
  ? JSON.parse(userData)?.userType === 'Admin'
    ? AllRoutes
    : AllRoutes.filter((item) => {
        // always include these keys even for sub-admins
        const alwaysIncludeKeys = ['general', 'dashboard']
        if (alwaysIncludeKeys.includes(item.key)) return true

        if (item.permission) {
          return JSON.parse(userData)?.permissions?.includes(item.permission)
        }
        return true
      })
  : []

  export const getMenuItems = () => {
  if (typeof window === "undefined") return []; // SSR safe

  const alwaysIncludeKeys = ["general", "dashboard"];

  try {
    const raw = localStorage.getItem("userData");
    if (!raw) return AllRoutes.filter((i) => alwaysIncludeKeys.includes(i.key));

    const user = JSON.parse(raw);
    if (user?.userType === "Admin") {
      return AllRoutes;
    }

    const permissions = Array.isArray(user?.permissions) ? user.permissions : [];

    return AllRoutes.filter((item) => {
      if (alwaysIncludeKeys.includes(item.key)) return true;
      if (item.permission) return permissions.includes(item.permission);
      return true;
    });
  } catch (e) {
    return AllRoutes.filter((i) => alwaysIncludeKeys.includes(i.key));
  }
};

// export const MENU_ITEMS = [
//   {
//     key: 'general',
//     label: 'GENERAL',
//     isTitle: true,
//   },
//   {
//     key: 'dashboard',
//     label: 'Dashboard',
//     icon: 'solar:widget-5-bold-duotone',
//     url: '/dashboard',
//   },
//   {
//     key: 'language',
//     label: 'Language',
//     icon: 'mdi:translate',
//     url: '/language/language-list',
//     permission: 'Language',
//   },
//   {
//     key: 'user',
//     label: 'User',
//     icon: 'solar:users-group-two-rounded-bold-duotone',
//     url: '/user/user-list',
//     permission: 'User',
//   },
//   {
//     key: 'notification',
//     label: 'Notification',
//     icon: 'solar:bell-bold-duotone',
//     url: '/notification',
//     permission: 'Notification',
//   },
//   {
//     key: 'subAdmin',
//     label: 'Sub Admin',
//     icon: 'solar:shield-user-line-duotone',
//     url: '/subAdmin/subAdmin-list',
//     permission: 'SubAdmin',
//   },
//   {
//     key: 'genre',
//     label: 'Genre',
//     icon: 'solar:document-text-line-duotone',
//     url: '/genre/genre-list',
//     permission: 'Genre',
//   },
//   {
//     key: 'movie',
//     label: 'Movie',
//     icon: 'solar:clapperboard-open-play-line-duotone',
//     url: '/movie/movie-list',
//     permission: 'Movie',
//   },
//   {
//     key: 'subscription',
//     label: 'Subscription',
//     icon: 'solar:cloud-sun-line-duotone',
//     url: '/subscription/subscription-list',
//     permission: 'Subscription',
//   },
//   {
//     key: 'transaction',
//     label: 'Transaction',
//     icon: 'solar:file-download-line-duotone',
//     url: '/transaction',
//     permission: 'Transaction',
//   },
//   {
//     key: 'faq',
//     label: 'Faq',
//     icon: 'solar:question-circle-bold-duotone',
//     url: '/faq/faq-list',
//     permission: 'Faq',
//   },
//   {
//     key: 'company',
//     label: 'Company',
//     icon: 'solar:settings-bold-duotone',
//     url: '/company',
//     permission: 'Company',
//   },
// ]
