import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast/headless";
import { requestApi } from "../api/requestApi";
import { approvalApi } from "../../approvals/api/approvalApi";
import { sponsorshipTypeApi, type SponsorshipType } from "../../admin/api/sponsorshipTypeApi";
import { RequestStatus } from "../../../constants/requestStatus";
import Loading from "../../../components/ui/Loading";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  department: z.string().min(2, "Department is required"),
  eventName: z.string().min(1, "Event name is required"),
  eventDate: z.string().min(1, "Event date is required"),
  sponsorshipTypeId: z.string().min(1, "Sponsorship type is required"),
  requestedAmount: z.number().min(1, "Amount must be greater than 0"),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
  expectedBenefit: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required ? " *" : ""}
      </label>
      {children}
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-card p-6 md:p-7">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export default function CreateRequestPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [sponsorshipTypes, setSponsorshipTypes] = useState<SponsorshipType[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const init = async () => {
      try {
        const types = await sponsorshipTypeApi.getAll();
        setSponsorshipTypes(types || []);

        if (isEditMode && id) {
          const data = await requestApi.getById(id);
          if (!data || data.status !== "Draft") {
            toast.error("Only draft requests can be edited");
            navigate(-1);
            return;
          }

          const typeMatch = (types || []).find((t) => t.name === data.sponsorshipType);
          reset({
            title: data.title || "",
            department: data.department || "",
            eventName: data.eventName || "",
            eventDate: data.eventDate ? data.eventDate.split("T")[0] : "",
            sponsorshipTypeId: typeMatch?.id || "",
            requestedAmount: data.requestedAmount || 0,
            purpose: data.purpose || "",
            expectedBenefit: data.expectedBusinessBenefit || "",
          });
        }
      } catch {
        if (isEditMode) {
          toast.error("Failed to load request");
          navigate(-1);
        } else {
          toast.error("Failed to load sponsorship types");
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, isEditMode, navigate, reset]);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100";

  const amountHint = useMemo(
    () => "Use numbers only. Example: 50000",
    []
  );

  const updateRequest = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await requestApi.update(id!, data);
      toast.success("Request updated successfully");
      navigate(-1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await requestApi.create({ ...data, status: RequestStatus.Draft });
      toast.success("Request saved as draft");
      navigate("/my-requests");
    } catch {
      toast.error("Failed to save draft");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitRequest = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const request = await requestApi.create({ ...data, status: RequestStatus.Draft });
      await approvalApi.submitRequest(request.id);
      toast.success("Request submitted for approval");
      navigate("/my-requests");
    } catch {
      toast.error("Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 p-6 text-white shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Sponsorship Workflow</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {isEditMode ? "Edit Sponsorship Request" : "Create Sponsorship Request"}
        </h1>
        <p className="mt-2 text-sm text-slate-200">
          Fill in the details clearly so reviewers can approve faster.
        </p>
      </div>

      <form onSubmit={handleSubmit(isEditMode ? updateRequest : submitRequest)} className="space-y-5">
        <Section title="Basic Information" subtitle="Core request identity and ownership.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Title" required error={errors.title?.message}>
              <input {...register("title")} className={inputClass} placeholder="Campus Tech Summit 2026 Sponsorship" />
            </Field>
            <Field label="Department" required error={errors.department?.message}>
              <input {...register("department")} className={inputClass} placeholder="Marketing" />
            </Field>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <Field label="Sponsorship Type" required error={errors.sponsorshipTypeId?.message}>
              <select {...register("sponsorshipTypeId")} className={inputClass}>
                <option value="">Select sponsorship type</option>
                {sponsorshipTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Event & Budget" subtitle="Event timeline and financial request.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Event Name" required error={errors.eventName?.message}>
              <input {...register("eventName")} className={inputClass} placeholder="Dhaka Innovation Forum" />
            </Field>
            <Field label="Event Date" required error={errors.eventDate?.message}>
              <input type="date" {...register("eventDate")} className={inputClass} />
            </Field>
            <Field label="Requested Amount ($)" required error={errors.requestedAmount?.message}>
              <input
                type="number"
                {...register("requestedAmount", { valueAsNumber: true })}
                className={inputClass}
                placeholder="50000"
              />
              <p className="text-xs text-slate-500">{amountHint}</p>
            </Field>
          </div>
        </Section>

        <Section title="Business Justification" subtitle="Explain why this sponsorship should be approved.">
          <div className="space-y-4">
            <Field label="Purpose" required error={errors.purpose?.message}>
              <textarea
                {...register("purpose")}
                rows={5}
                className={inputClass}
                placeholder="Describe the sponsorship objective, audience, and outcome expectations."
              />
            </Field>
            <Field label="Expected Business Benefit" error={errors.expectedBenefit?.message}>
              <textarea
                {...register("expectedBenefit")}
                rows={4}
                className={inputClass}
                placeholder="Expected ROI, brand exposure, leads, or strategic benefits."
              />
            </Field>
          </div>
        </Section>

        <div className="flex flex-wrap items-center justify-end gap-3 pb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          {isEditMode ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Request"}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSubmit(saveDraft)}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit for Approval"}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
