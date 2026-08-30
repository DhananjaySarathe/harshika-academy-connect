import { useRef, useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  academy,
  classOptions,
  fullAddress,
  mapDirectionsUrl,
  mapEmbedUrl,
  whatsappUrl,
} from "@/data/content";
import { ctaClass, ghostClass, Reveal, SectionHeading } from "./shared";

type FormValues = {
  studentName: string;
  parentName: string;
  phone: string;
  studentClass: string;
  subjects: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const emptyForm: FormValues = {
  studentName: "",
  parentName: "",
  phone: "",
  studentClass: "",
  subjects: "",
  message: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.studentName.trim()) errors.studentName = "Enter the student's name.";
  if (!values.parentName.trim()) errors.parentName = "Enter the parent's name.";
  const digits = values.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  if (!/^[6-9]\d{9}$/.test(digits)) errors.phone = "Enter a 10-digit phone number.";
  if (!values.studentClass) errors.studentClass = "Select a class.";
  return errors;
}

const labelClass = "block text-[13px] font-semibold text-ink-2";

const controlClass =
  "mt-1.5 w-full rounded-lg border border-line bg-surface-2 px-3 text-sm text-ink-1 outline-none transition-colors placeholder:text-ink-4 focus:border-ink-3 focus:ring-2 focus:ring-ink-1/10";

// Red rather than lime: an error must not read as an accent.
const errorRingClass = "border-[#B4342A] focus:border-[#B4342A] focus:ring-[#B4342A]/15";
const errorTextClass = "mt-1.5 text-xs font-medium text-[#B4342A]";

export function Contact() {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = (field: keyof FormValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);

    const firstError = Object.keys(found)[0];
    if (firstError) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }
    setSent(true);
  };

  const reset = () => {
    setValues(emptyForm);
    setErrors({});
    setSubmitted(false);
    setSent(false);
  };

  return (
    <section id="contact" className="scroll-mt-20 bg-canvas px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Get in touch"
            title="Come see the"
            highlight="classroom"
            intro="Call, message or visit us. We will help you find the right batch for your child."
          />

          <Reveal delay={120}>
            <div className="mt-8 space-y-5">
              <ContactRow icon={<Phone className="size-4" />} label="Phone / WhatsApp">
                <a href={academy.phoneHref} className="focus-ring-ink rounded hover:text-ink-1">
                  {academy.phone}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="focus-ring-ink ml-3 inline-flex rounded-md border border-line bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-ink-2 transition-colors hover:border-line-strong"
                >
                  WhatsApp
                </a>
              </ContactRow>

              <ContactRow icon={<Mail className="size-4" />} label="Email">
                <a
                  href={`mailto:${academy.email}`}
                  className="focus-ring-ink rounded hover:text-ink-1"
                >
                  {academy.email}
                </a>
              </ContactRow>

              <ContactRow icon={<MapPin className="size-4" />} label="Address">
                <address className="not-italic">{fullAddress}</address>
              </ContactRow>

              <ContactRow icon={<Clock className="size-4" />} label="Class timings">
                {academy.timings}
              </ContactRow>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <ul className="mt-7 flex flex-wrap gap-4 text-[13px] font-medium text-ink-3">
              {academy.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring-ink rounded transition-colors hover:text-ink-1"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={240}>
            {/* No dark filter here — on a light page the map reads correctly as-is. */}
            <div className="mt-7 overflow-hidden rounded-xl border border-line">
              <iframe
                title={`Map showing ${academy.name} at ${fullAddress}`}
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-60 w-full border-0"
              />
            </div>
            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(ghostClass, "mt-4 h-10 text-[13px]")}
            >
              Get directions
            </a>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <div className="rounded-xl border border-line bg-surface-2 p-5 sm:p-7">
            <h3 className="text-xl font-bold tracking-tight text-ink-1">Send an enquiry</h3>

            {sent ? (
              <div className="mt-6 rounded-lg border border-line bg-lime-tint/40 p-4" role="status">
                <p className="text-base font-semibold text-ink-1">Enquiry sent.</p>
                <p className="mt-1 text-sm text-ink-2">We&rsquo;ll call you within a day.</p>
                <button
                  type="button"
                  onClick={reset}
                  className="focus-ring-ink mt-3 rounded text-sm font-semibold text-ink-1 underline decoration-lime-strong decoration-2 underline-offset-4"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form ref={formRef} className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
                <Field
                  name="studentName"
                  label="Student name"
                  autoComplete="name"
                  value={values.studentName}
                  error={errors.studentName}
                  onChange={(value) => setField("studentName", value)}
                />
                <Field
                  name="parentName"
                  label="Parent's name"
                  autoComplete="name"
                  value={values.parentName}
                  error={errors.parentName}
                  onChange={(value) => setField("parentName", value)}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    name="phone"
                    label="Phone number"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={values.phone}
                    error={errors.phone}
                    onChange={(value) => setField("phone", value)}
                  />

                  <div>
                    <label htmlFor="v2-studentClass" className={labelClass}>
                      Class
                    </label>
                    <select
                      id="v2-studentClass"
                      name="studentClass"
                      value={values.studentClass}
                      onChange={(event) => setField("studentClass", event.target.value)}
                      aria-invalid={errors.studentClass ? true : undefined}
                      aria-describedby={errors.studentClass ? "v2-studentClass-error" : undefined}
                      className={cn(controlClass, "h-11", errors.studentClass && errorRingClass)}
                    >
                      <option value="">Select class</option>
                      {classOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.studentClass ? (
                      <p id="v2-studentClass-error" className={errorTextClass}>
                        {errors.studentClass}
                      </p>
                    ) : null}
                  </div>
                </div>

                <Field
                  name="subjects"
                  label="Subjects of interest"
                  value={values.subjects}
                  onChange={(value) => setField("subjects", value)}
                />

                <div>
                  <label htmlFor="v2-message" className={labelClass}>
                    Message (optional)
                  </label>
                  <textarea
                    id="v2-message"
                    name="message"
                    rows={4}
                    value={values.message}
                    onChange={(event) => setField("message", event.target.value)}
                    className={cn(controlClass, "resize-none py-2.5")}
                  />
                </div>

                <button type="submit" className={cn(ctaClass, "h-12 w-full")}>
                  Send enquiry
                </button>

                <p className="text-center text-xs leading-[1.6] text-ink-3">
                  In a hurry?{" "}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring-ink rounded font-semibold text-ink-1 underline decoration-lime-strong decoration-2 underline-offset-4"
                  >
                    Message us directly on WhatsApp.
                  </a>
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  type = "text",
  error,
  autoComplete,
  inputMode,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string | undefined;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "tel";
}) {
  return (
    <div>
      <label htmlFor={`v2-${name}`} className={labelClass}>
        {label}
      </label>
      <input
        id={`v2-${name}`}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `v2-${name}-error` : undefined}
        className={cn(controlClass, "h-11", error && errorRingClass)}
      />
      {error ? (
        <p id={`v2-${name}-error`} className={errorTextClass}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3.5">
      <span
        className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-surface text-ink-3"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">{label}</p>
        <div className="mt-1 break-words text-sm leading-[1.65] text-ink-2">{children}</div>
      </div>
    </div>
  );
}
