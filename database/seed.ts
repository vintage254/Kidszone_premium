import dummyJobsData from "../dummybooks.json";
import { jobs } from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

/**
 * --- Seed Script for Jobs ---
 * 
 * This script seeds the database with job postings.
 * It reads from `dummybooks.json` (a legacy file name).
 * 
 * IMPORTANT: The user must update `dummybooks.json` to contain an array of job objects
 * that match the 'jobs' schema in `database/schema.ts`.
 * 
 * To run this script, execute `npm run seed` in your terminal.
 */

const dummyJobs: any[] = dummyJobsData;

const seed = async () => {
  console.log("--- Starting Job Seeding Script ---");

  if (!dummyJobs || dummyJobs.length === 0) {
    console.log("No job data found in dummybooks.json. Exiting.");
    return;
  }

  try {
    // 1. Clear existing jobs to prevent duplicates.
    console.log("🗑️ Deleting existing jobs...");
    await db.delete(jobs);
    console.log("✅ Existing jobs deleted.");
    
    // 2. Prepare and insert new jobs from the JSON file.
    console.log(`🌱 Seeding ${dummyJobs.length} new jobs...`);
    const jobsToInsert = dummyJobs.map((job) => {
      // Omit the 'id' field to let the database auto-generate it.
      // Also, convert date strings to Date objects for Drizzle.
      const { id, ...jobData } = job;
      return {
        ...jobData,
        createdAt: new Date(job.createdAt),
        updatedAt: new Date(job.updatedAt),
        deadline: job.deadline ? new Date(job.deadline) : null,
      };
    });

    await db.insert(jobs).values(jobsToInsert);

    console.log("🎉 Jobs data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding jobs data:", error);
  }

  console.log("--- Job Seeding Script Finished ---");
};

seed();
