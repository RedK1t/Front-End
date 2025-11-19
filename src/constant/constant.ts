export const dumb = {
  path: "/",
  method: null,
  children: [
    {
      path: "/auth",
      method: "GET",
      children: [
        {
          path: "/auth/login",
          method: "POST",
          children: [],
        },
        {
          path: "/auth/register",
          method: "POST",
          children: [],
        },
        {
          path: "/auth/user",
          method: "GET",
          children: [],
        },
      ],
    },
    {
      path: "/api",
      method: null,
      children: [
        {
          path: "/api/v1",
          method: null,
          children: [
            {
              path: "/api/v1/users",
              method: "GET",
              children: [],
            },
            {
              path: "/api/v1/users/create",
              method: "POST",
              children: [],
            },
            {
              path: "/api/v1/posts",
              method: "GET",
              children: [
                {
                  path: "/api/v1/posts/:id",
                  method: "GET",
                  children: [],
                },
                {
                  path: "/api/v1/posts/:id/update",
                  method: "PUT",
                  children: [],
                },
                {
                  path: "/api/v1/posts/:id/delete",
                  method: "DELETE",
                  children: [],
                },
              ],
            },
          ],
        },
        {
          path: "/api/v2",
          method: null,
          children: [
            {
              path: "/api/v2/products",
              method: "GET",
              children: [
                {
                  path: "/api/v2/products/create",
                  method: "POST",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/status",
      method: "GET",
      children: [],
    },
  ],
};
