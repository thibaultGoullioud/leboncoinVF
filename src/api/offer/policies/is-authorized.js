module.exports = async (policyContext, config, { strapi }) => {
  try {
    const requesterId = policyContext.state.user.id;

    if (policyContext.request.params.id) {
      const offerId = policyContext.request.params.id;
      const offer = await strapi.entityService.findOne(
        "api::offer.offer",
        offerId,
        { populate: ["owner"] }
      );

      if (!offer) {
        return policyContext.forbidden("Offer not found.");
      }

      if (requesterId === offer.owner.id) {
        return true;
      } else {
        return policyContext.forbidden(
          "You are not authorized to perform this action."
        );
      }
    } else {
      if (!policyContext.request.body || !policyContext.request.body.data) {
        return policyContext.badRequest("Invalid request body.");
      }

      const ownerId = JSON.parse(policyContext.request.body.data).owner;

      if (!ownerId) {
        return policyContext.badRequest("Owner ID is missing.");
      }

      if (requesterId !== ownerId) {
        return policyContext.forbidden(
          "You are not authorized to perform this action."
        );
      } else {
        return true;
      }
    }
  } catch (error) {
    strapi.log.error("Authorization policy error:", error);
    return policyContext.internalServerError("An unexpected error occurred.");
  }
};
