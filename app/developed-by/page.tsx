import Image from "next/image";
import { SiteShell } from "@/components/site-shell";

const teamMembers = [
  {
    name: "Aadityasiva S",
    detail: "25BCE1879",
    photo: "/aadityasiva.jpeg",
    role: "Developer",
  },
  {
    name: "Boyina Suryaa",
    detail: "25BCE1867",
    photo: "/surya.jpeg",
    role: "developer",
  },
  {
    name: "Dr. Swaminathan A",
    detail: "Assistant Professor",
    photo: "/drswaminathan.jpg",
    role: "Guided by",
  },
];

export default function DevelopedBy() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-5 py-16">
        <p className="eyebrow">The people behind the lab</p>
        <h1 className="display mt-4 text-6xl font-black">Developed by.</h1>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div className="panel rounded-3xl p-5" key={member.name}>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--ink)]">
                <Image
                  src={member.photo}
                  alt={`${member.name} photograph`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <p className="eyebrow mt-5">{member.role}</p>
              <h2 className="mt-2 text-2xl font-black">{member.name}</h2>
              <p className="mt-1 text-md text-[var(--muted)]">
                {member.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
