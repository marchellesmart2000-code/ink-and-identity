import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        if (params.flow === "signUp") {
          throw new Error("Public registration is disabled.");
        }
        const email = String(params.email ?? "")
          .trim()
          .toLowerCase();
        if (!email) {
          throw new Error("Email is required.");
        }
        return { email };
      },
      validatePasswordRequirements(password) {
        if (password.length < 12) {
          throw new Error("Password must be at least 12 characters.");
        }
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx: MutationCtx, args) {
      if (args.existingUserId) {
        return args.existingUserId;
      }
      const role = args.profile.role;
      if (role !== "admin" && role !== "editor") {
        throw new Error("Staff accounts can only be created by an administrator.");
      }
      return await ctx.db.insert("users", {
        email: String(args.profile.email ?? "")
          .trim()
          .toLowerCase(),
        name: typeof args.profile.name === "string" ? args.profile.name : undefined,
        role,
        status: "active",
      });
    },
    async beforeSessionCreation(ctx, { userId }) {
      const user = await ctx.db.get(userId as Id<"users">);
      if (!user || user.status === "disabled") {
        throw new Error("This account is not active.");
      }
      if (user.role !== "admin" && user.role !== "editor") {
        throw new Error("This account does not have studio access.");
      }
    },
  },
});
