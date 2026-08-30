import { useRef, useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  academy,
  classOptions,
  fullAddress,
  mapDirectionsUrl,
  mapEmbedUrl,
  whatsappUrl,
} from "@/data/content";
import { Reveal, SectionHeading } from "./shared";

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
  // Indian mobile numbers are 10 digits starting 6–9; ignore spaces and +91.
  const digits = values.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  if (!/^[6-9]\d{9}$/.test(digits)) errors.phone = "Enter a 10-digit phone number.";
  if (!values.studentClass) errors.studentClass = "Select a class.";
  return errors;
}

export function Contact() {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = (field: keyof FormValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Only re-validate live once they've tried to submit — no scolding as they type.
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

    // No backend on this site — the enquiry is confirmed inline and the academy
    // is reached on WhatsApp or the phone. Wire a real endpoint in here later.
    setSent(true);
  };

  const reset = () => {
    setValues(emptyForm);
    setErrors({});
    setSubmitted(false);
    setSent(false);
  };

  return (
    <section id="contact" className="scroll-mt-28 px-5 py-14 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Get In Touch"
            title="Come See The"
            highlight="Classroom"
            intro="Call, message or visit us. We will help you find the right batch for your child."
          />

          <Reveal delay={120}>
            <div className="mt-9 space-y-6">
              <ContactRow icon={<Phone className="size-5" />} label="Phone / WhatsApp">
                <a href={academy.phoneHref} className="focus-ring rounded hover:text-gold">
                  {academy.phone}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="focus-ring ml-3 inline-flex rounded-full border border-gold/30 px-3 py-1 text-xs text-gold transition-colors hover:bg-gold/10"
                >
                  WhatsApp
                </a>
              </ContactRow>

              <ContactRow icon={<Mail className="size-5" />} label="Email">
                <a href={`mailto:${academy.email}`} className="focus-ring rounded hover:text-gold">
                  {academy.email}
                </a>
              </ContactRow>

              <ContactRow icon={<MapPin className="size-5" />} label="Address">
                <address className="not-italic">{fullAddress}</address>
              </ContactRow>

              <ContactRow icon={<Clock className="size-5" />} label="Class Timings">
                {academy.timings}
              </ContactRow>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <ul className="mt-8 flex flex-wrap gap-5 font-utility text-xs font-semibold uppercase tracking-wider text-body">
              {academy.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring rounded transition-colors hover:text-gold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-gold/[0.18] bg-panel">
              <iframe
                title={`Map showing ${academy.name} at ${fullAddress}`}
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map-dark h-64 w-full border-0"
              />
            </div>
            <Button
              asChild
              variant="outline"
              className="focus-ring mt-4 rounded-full border-gold/30 bg-transparent text-gold transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              <a href={mapDirectionsUrl} target="_blank" rel="noreferrer noopener">
                Get Directions
              </a>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <div className="rounded-2xl border border-gold/[0.18] bg-panel p-6 sm:p-9">
            <h3 className="font-display text-3xl uppercase leading-none text-heading">
              Send An Enquiry
            </h3>

            {sent ? (
              <div className="mt-8 border-l-2 border-gold pl-5" role="status">
                <p className="font-display text-2xl uppercase leading-tight text-gold">
                  Enquiry sent.
                </p>
                <p className="mt-2 text-sm leading-[1.65] text-body">
                  We&rsquo;ll call you within a day.
                </p>
                <Button
                  variant="link"
                  onClick={reset}
                  className="focus-ring mt-3 h-auto px-0 text-gold"
                >
                  Send another enquiry
                </Button>
              </div>
            ) : (
              <form ref={formRef} className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
                <Field
                  name="studentName"
                  label="Student Name"
                  autoComplete="name"
                  value={values.studentName}
                  error={errors.studentName}
                  onChange={(value) => setField("studentName", value)}
                />
                <Field
                  name="parentName"
                  label="Parent's Name"
                  autoComplete="name"
                  value={values.parentName}
                  error={errors.parentName}
                  onChange={(value) => setField("parentName", value)}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={values.phone}
                    error={errors.phone}
                    onChange={(value) => setField("phone", value)}
                  />

                  <div>
                    <label htmlFor="studentClass" className={labelClass}>
                      Class
                    </label>
                    <select
                      id="studentClass"
                      name="studentClass"
                      value={values.studentClass}
                      onChange={(event) => setField("studentClass", event.target.value)}
                      aria-invalid={errors.studentClass ? true : undefined}
                      aria-describedby={errors.studentClass ? "studentClass-error" : undefined}
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
                      <p id="studentClass-error" className={errorTextClass}>
                        {errors.studentClass}
                      </p>
                    ) : null}
                  </div>
                </div>

                <Field
                  name="subjects"
                  label="Subject(s) of interest"
                  value={values.subjects}
                  onChange={(value) => setField("subjects", value)}
                />

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={values.message}
                    onChange={(event) => setField("message", event.target.value)}
                    className={cn(controlClass, "resize-none py-3")}
                  />
                </div>

                <Button
                  type="submit"
                  className="focus-ring h-12 w-full rounded-full bg-gold-fill font-utility text-xs font-bold uppercase tracking-widest text-on-gold transition-colors hover:bg-gold-fill-strong"
                >
                  Send Enquiry
                </Button>

                <p className="text-center text-xs leading-[1.65] text-body">
                  In a hurry?{" "}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring rounded font-semibold text-gold transition-colors hover:text-gold-bright"
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

const labelClass = "font-utility text-[10px] font-semibold uppercase tracking-wider text-gold/80";

const controlClass =
  "mt-2 w-full rounded-lg border border-gold/20 bg-page px-3 text-sm text-heading outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30";

const errorRingClass = "border-danger/60 focus:border-danger focus:ring-danger/25";

const errorTextClass = "mt-1.5 text-xs text-danger";

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
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(controlClass, "h-11", error && errorRingClass)}
      />
      {error ? (
        <p id={`${name}-error`} className={errorTextClass}>
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
    <div className="flex gap-4">
      <span className="mt-0.5 shrink-0 text-gold" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-utility text-[10px] font-semibold uppercase tracking-widest text-gold/80">
          {label}
        </p>
        <div className="mt-1 break-words text-sm leading-[1.65] text-body">{children}</div>
      </div>
    </div>
  );
}
