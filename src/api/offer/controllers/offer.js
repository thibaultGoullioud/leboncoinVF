"use strict";

/**
 * offer controller
 */

"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::offer.offer", ({ strapi }) => ({
  async deleteAll(ctx) {
    try {
      const userId = ctx.state.user?.id;

      if (!userId) {
        return ctx.unauthorized(
          "You must be logged in to perform this action."
        );
      }

      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userId,
        { populate: ["offers"] }
      );

      if (!user || !user.offers) {
        return ctx.notFound("No offers found for the user.");
      }

      const deletePromises = user.offers.map((offer) =>
        strapi.entityService.delete("api::offer.offer", offer.id)
      );

      await Promise.all(deletePromises);

      return { message: "All your offers have been deleted successfully." };
    } catch (error) {
      ctx.response.status = 500;
      return { message: `Failed to delete offers: ${error.message}` };
    }
  },

  //   async create(ctx) {
  //    try {
  //       const requesterId = ctx.state.user?.id;

  //       if (!requesterId) {
  //         return ctx.unauthorized(
  //           "You must be logged in to perform this action."
  //         );
  //       }

  //       const { data } = ctx.request.body;

  //       if (!data) {
  //         return ctx.badRequest("Missing offer data.");
  //       }

  //       const ownerId = data.owner;

  //       if (requesterId !== ownerId) {
  //         ctx.response.status = 403;
  //         return { message: "You must be the offer's owner." };
  //       }

  //       const newOffer = await strapi.entityService.create("api::offer.offer", {
  //         data,
  //       });

  //       return ctx.created(newOffer);
  //     } catch (error) {
  //       ctx.response.status = 500;
  //       return { message: `Failed to create offer: ${error.message}` };
  //     }
  //   },
}));
