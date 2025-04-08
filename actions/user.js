"use server";

// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";
// import { generateAIInsights } from "./dashboard";
// //import { generateAIInsights } from "./dashboard";

// export async function updateUser(data) {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) throw new Error("User not found");

//   try {
//     // Start a transaction to handle both operations
//     const result = await db.$transaction(
//       async (tx) => {
//         // First check if industry exists
//         let industryInsight = await tx.industryInsight.findUnique({
//           where: {
//             industry: data.industry,
//           },
//         });

//         // If industry doesn't exist, create it with default values
//         if (!industryInsight) {
//           const insights = await generateAIInsights(data.industry);

//           industryInsight = await db.industryInsight.create({
//             data: {
//               industry: data.industry,
//               ...insights,
//               nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//             },
//           });
//         }

//         // Now update the user
//         const updatedUser = await tx.user.update({
//           where: {
//             id: user.id,
//           },
//           data: {
//             industry: data.industry,
//             experience: data.experience,
//             bio: data.bio,
//             skills: data.skills,
//           },
//         });

//         return { updatedUser, industryInsight };
//       },
//       {
//         timeout: 10000, // default: 5000
//       }
//     );

//     revalidatePath("/");
//     return { success: true, ...result };
//   } catch (error) {
//     console.error("Error updating user and industry:", error.message);
//     throw new Error("Failed to update profile" + error.message);
//   }
// }

// export async function getUserOnboardingStatus() {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) throw new Error("User not found");

//   try {
//     const user = await db.user.findUnique({
//       where: {
//         clerkUserId: userId,
//       },
//       select: {
//         industry: true,
//       },
//     });

//     return {
//       isOnboarded: !!user?.industry,
//     };
//   } catch (error) {
//     console.error("Error checking onboarding status:", error);
//     throw new Error("Failed to check onboarding status");
//   }
// }
// "use server";

// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";
// import { generateAIInsights } from "./dashboard";

// export async function updateUser(data) {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) throw new Error("User not found");

//   try {
//     const result = await db.$transaction(async (tx) => {
//       let industryInsight = await tx.industryInsight.findUnique({
//         where: { industry: data.industry },
//       });

//       if (!industryInsight) {
//         let insights;
//         try {
//           insights = await generateAIInsights(data.industry);

//           // ✅ Convert demandLevel to a valid enum
//           const demandLevelMap = {
//             High: "HIGH",
//             Medium: "MEDIUM",
//             Low: "LOW",
//           };
//           insights.demandLevel = demandLevelMap[insights.demandLevel] || "MEDIUM"; // Default to MEDIUM if invalid

//         } catch (aiError) {
//           console.error("AI Insights generation failed:", aiError);
//           insights = {
//             demandLevel: "MEDIUM",
//             salaryRanges: [],
//             growthRate: 0,
//             topSkills: [],
//             marketOutlook: "NEUTRAL",
//             keyTrends: [],
//             recommendedSkills: [],
//           };
//         }

//         industryInsight = await tx.industryInsight.create({
//           data: {
//             industry: data.industry,
//             ...insights,
//             nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//           },
//         });
//       }

//       const updatedUser = await tx.user.update({
//         where: { id: user.id },
//         data: {
//           industry: data.industry,
//           experience: data.experience,
//           bio: data.bio,
//           skills: data.skills,
//         },
//       });

//       return { updatedUser, industryInsight };
//     }, { timeout: 10000 });

//     revalidatePath("/");
//     return { success: true, ...result };
//   } catch (error) {
//     console.error("Error updating user and industry:", error.message);
//     throw new Error("Failed to update profile: " + error.message);
//   }
// }
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";
import { DemandLevel, MarketOutlook } from "@prisma/client";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const result = await db.$transaction(
      async (tx) => {
        let industryInsight = await tx.industryInsight.findUnique({
          where: { industry: data.industry },
        });

        if (!industryInsight) {
          let insights;
          try {
            insights = await generateAIInsights(data.industry);

            // Convert string enums to actual Prisma enums
            if (typeof insights.demandLevel === "string") {
              insights.demandLevel =
                DemandLevel[insights.demandLevel.toUpperCase()];
            }

            if (typeof insights.marketOutlook === "string") {
              insights.marketOutlook =
                MarketOutlook[insights.marketOutlook.toUpperCase()];
            }
          } catch (error) {
            console.error("Error generating AI insights:", error);
            insights = {
              demandLevel: DemandLevel.MEDIUM,
              marketOutlook: MarketOutlook.NEUTRAL,
              salaryRanges: [],
              growthRate: 0,
              topSkills: [],
              keyTrends: [],
              recommendedSkills: [],
            };
          }

          industryInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000,
      }
    );

    revalidatePath("/");
    return result.updatedUser;
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    return { isOnboarded: !!user?.industry };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
