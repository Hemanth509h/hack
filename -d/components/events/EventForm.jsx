import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  AlignLeft,
  Info,
  Loader2,
} from "lucide-react";
import { useCreateEventMutation } from "../../services/eventApi";
import { useGetUsersQuery } from "../../features/admin/adminApi";
import { useNavigate, useSearchParams } from "react-router-dom";

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date and Time is required"),
  durationMinutes: z.coerce.number().min(15).max(1440),
  locationDetails: z.string().min(1, "Location is required"),
  capacity: z.coerce.number().optional(),
  coverImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  organizerId: z.string().min(1, "An event organizer must be assigned"),
});

export const EventForm = () => {
  const [step, setStep] = useState(1);
  const [createEvent, { isLoading }] = useCreateEventMutation();
  const { data: usersData } = useGetUsersQuery({
    page: 1,
    limit: 100,
    role: "student",
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      durationMinutes: 60,
    },
  });

  const nextStep = async () => {
    const fieldsToValidate =
      step === 1
        ? ["title", "category", "description", "organizerId"]
        : ["date", "durationMinutes", "locationDetails"];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data) => {
    try {
      const result = await createEvent({
        ...data,
        club: clubId || undefined,
        tags: [],
        targetAudience: { majors: [], years: [] },
      }).unwrap();
      navigate(`/events/${result._id}`);
    } catch (error) {
      console.error("Submission error", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-50 dark:bg-gray-800 rounded-full"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>

          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                step >= num
                  ? "bg-indigo-600 text-gray-900 dark:text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-500"
              }`}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mt-3 -mx-2">
          <span className="w-1/3 text-center">Basic Info</span>
          <span className="w-1/3 text-center">Logistics</span>
          <span className="w-1/3 text-center">Review</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <Info className="text-indigo-400" /> Basic Information
                  </h2>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Event Title
                  </label>
                  <input
                    {...register("title")}
                    className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    placeholder="E.g., Intro to Machine Learning"
                  />

                  {errors.title && (
                    <p className="text-red-400 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    {...register("category")}
                    className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Hackathons">Hackathons</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Career">Career</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assigned Organizer
                  </label>
                  <select
                    {...register("organizerId")}
                    className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                  >
                    <option value="">Select a Student</option>
                    {usersData?.users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {errors.organizerId && (
                    <p className="text-red-400 text-sm">
                      {errors.organizerId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none"
                    placeholder="What is this event about?"
                  />

                  {errors.description && (
                    <p className="text-red-400 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <Calendar className="text-indigo-400" /> Logistics
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      {...register("date")}
                      className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                      style={{ colorScheme: "dark" }}
                    />

                    {errors.date && (
                      <p className="text-red-400 text-sm">
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      {...register("durationMinutes")}
                      className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    />

                    {errors.durationMinutes && (
                      <p className="text-red-400 text-sm">
                        {errors.durationMinutes.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400" /> Location
                    Details
                  </label>
                  <input
                    {...register("locationDetails")}
                    className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    placeholder="Room Number, Zoom Link, etc."
                  />

                  {errors.locationDetails && (
                    <p className="text-red-400 text-sm">
                      {errors.locationDetails.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Capacity (Optional)
                  </label>
                  <input
                    type="number"
                    {...register("capacity")}
                    placeholder="Leave blank for unlimited"
                    className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <AlignLeft className="text-indigo-400" /> Final Touches
                  </h2>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cover Image URL (Optional)
                  </label>
                  <input
                    {...register("coverImage")}
                    className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    placeholder="https://example.com/banner.jpg"
                  />

                  {errors.coverImage && (
                    <p className="text-red-400 text-sm">
                      {errors.coverImage.message}
                    </p>
                  )}
                </div>

                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-sm text-indigo-200">
                  By clicking publish, you are confirming this event complies
                  with The Quad's community guidelines. Notification alerts will
                  be sent to corresponding clubs if relevant.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white text-sm font-medium rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-8 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-gray-900 dark:text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Publish Event
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
