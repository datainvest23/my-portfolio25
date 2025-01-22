"use client";

import { Hero } from "@/components/blocks/hero-with-orb-effect";

export default function ContactPage() {
  return (
    <Hero
      mainHeading="Let's Create Something Amazing Together"
      tagline="Have a project in mind? I'd love to hear about it. Drop me a message and let's discuss how we can collaborate."
      buttonLabel="Send Message"
      buttonHref="#"
      inputLabel="Your email address"
      caption="I'll get back to you within 24 hours"
    />
  );
} 