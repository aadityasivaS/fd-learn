"use client";

import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { ChevronDown } from "lucide-react";

type Section = {
  number: string;
  title: string;
  text: string;
  videoUrl: string;
  explanation: string[];
};

const sections: Section[] = [
  {
    number: "01",
    title: "Functional dependencies",
    text: "X → Y means that whenever two rows agree on X, they must agree on Y. X is the determinant; Y is the dependent. Example: Student_ID → Student_Name.",
    videoUrl: "https://www.youtube.com/embed/qn5neFBpU40",
    explanation: [
      "A functional dependency (FD) is a constraint between two sets of attributes in a relation. It states that if two tuples have the same value for attribute(s) X, they must have the same value for attribute(s) Y.",
      "The notation X → Y is read as 'X determines Y' or 'Y is functionally dependent on X'. X is called the determinant, and Y is called the dependent.",
      "Example: In a Student relation, Student_ID → Student_Name means that each student ID uniquely determines a student name. If two records have the same Student_ID, they must have the same Student_Name.",
      "Functional dependencies are fundamental to database normalization. They help identify which attributes should be grouped together in tables and which tables should be separated to eliminate data redundancy and anomalies.",
      "Common examples include: Employee_ID → Salary, Product_Code → Product_Price, and Course_ID → Course_Title. These dependencies ensure data consistency and integrity across the database.",
    ],
  },
  {
    number: "02",
    title: "Attribute closure",
    text: "The closure X+ is every attribute that X can determine by repeatedly applying the dependencies. Start with X, scan the set, and stop at a fixed point.",
    videoUrl: "https://www.youtube.com/embed/bSdvM_0hzgc",
    explanation: [
      "Attribute closure, denoted as X+, is the set of all attributes that can be functionally determined from attribute set X using the given functional dependencies.",
      "To calculate X+, start with X itself. Then repeatedly scan all functional dependencies: if the left-hand side is a subset of the current closure, add the right-hand side attributes to the closure. Continue until no new attributes are added (fixed point).",
      "Example: Given dependencies A → B, B → C, and C → D, the closure of {A} is calculated as: Start with {A}, apply A → B to get {A, B}, apply B → C to get {A, B, C}, apply C → D to get {A, B, C, D}. So A+ = {A, B, C, D}.",
      "Attribute closure is a key concept for finding superkeys and candidate keys. If X+ contains all attributes in the relation, then X is a superkey.",
      "Closures also help determine if a dependency X → Y is implied by a given set of dependencies. If Y ⊆ X+, then X → Y is implied. This is used to compute the canonical cover and minimize dependencies.",
    ],
  },
  {
    number: "03",
    title: "Superkeys and candidate keys",
    text: "If X+ contains every relation attribute, X is a superkey. It becomes a candidate key only when no attribute can be removed without losing that property.",
    videoUrl: "https://www.youtube.com/embed/_UZLrD_R0T4",
    explanation: [
      "A superkey is a set of one or more attributes that uniquely identifies each tuple in a relation. Formally, X is a superkey if X+ equals the set of all attributes in the relation.",
      "A candidate key is a minimal superkey—it is a superkey from which no attribute can be removed while still maintaining the uniqueness property. In other words, if you remove any single attribute from a candidate key, it is no longer a superkey.",
      "Example: In a Student relation with attributes {Student_ID, Name, Email, Phone}, if Student_ID uniquely identifies students, then {Student_ID} is both a superkey and a candidate key. The set {Student_ID, Name} is a superkey but not a candidate key because you can remove Name and still have a superkey.",
      "Every relation must have at least one candidate key. The primary key is simply a candidate key chosen by the database designer to serve as the main identifier for tuples in the relation.",
      "To find candidate keys, compute the closure of all possible attribute combinations. If an attribute combination's closure equals all relation attributes, it is a candidate key. A candidate key is minimal if no proper subset is also a candidate key.",
    ],
  },
  {
    number: "04",
    title: "Canonical cover",
    text: "A canonical cover keeps the same implications with less noise: decompose RHS attributes, remove extraneous LHS attributes, then remove redundant dependencies.",
    videoUrl: "https://www.youtube.com/embed/sS-LJMTVVj8",
    explanation: [
      "A canonical cover (or minimal cover) is an equivalent set of functional dependencies with minimal redundancy. It preserves the same logical implications as the original set but in a simplified form.",
      "The canonical cover is useful for database normalization, schema design, and query optimization. It reduces the number of constraints to check and eliminates redundant information.",
      "The algorithm to compute a canonical cover has three steps: (1) Decompose all dependencies so that each right-hand side has a single attribute. (2) Remove extraneous attributes from the left-hand side—if an attribute on the left is not needed to imply the right-hand side, remove it. (3) Remove redundant dependencies—if removing a dependency does not change the closure, remove it.",
      "Example: Given A → BC, AB → C, and A → B, we can decompose to get A → B, A → C, AB → C, A → B. Then check if AB → C is redundant: since A → B and A → C, we have A → BC, so AB → C is redundant and can be removed. The canonical cover is {A → B, A → C}.",
      "The canonical cover is not unique—different orderings of steps may produce different equivalent covers, but all canonical covers for the same dependency set are equivalent in their logical implications.",
    ],
  },
];

export default function Learn() {
  const [expandedCard, setExpandedCard] = useState<string>("01");

  const toggleCard = (number: string) => {
    setExpandedCard(expandedCard === number ? "" : number);
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-5 py-16">
        <p className="eyebrow">Learn / concept studio</p>

        <h1 className="display mt-4 max-w-4xl text-6xl font-black">
          The logic behind the notation.
        </h1>

        <div className="mt-12 space-y-4">
          {sections.map((section) => (
            <article
              key={section.number}
              className={`panel rounded-3xl overflow-hidden transition-all duration-300 ${
                expandedCard === section.number
                  ? "border-2 border-[var(--accent)] ring-2 ring-[var(--accent)] ring-opacity-20"
                  : ""
              }`}
            >
              <header
                className="flex cursor-pointer items-center gap-4 p-6 hover:bg-[var(--panel)] transition-colors"
                onClick={() => toggleCard(section.number)}
              >
                <span className="font-mono text-lg text-[var(--accent)]">
                  {section.number}
                </span>

                <div className="flex-1">
                  <h2 className="text-xl font-black">{section.title}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{section.text}</p>
                </div>

                <ChevronDown
                  className={`transition-transform duration-300 ${
                    expandedCard === section.number ? "rotate-180" : ""
                  }`}
                  size={24}
                />
              </header>

              {expandedCard === section.number && (
                <div className="border-t border-[var(--panel)]">
                  <div className="aspect-video bg-[var(--ink)]">
                    <iframe
                      width="100%"
                      height="100%"
                      src={section.videoUrl}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={section.title}
                    ></iframe>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-black">Detailed Explanation</h3>
                    <div className="mt-4 space-y-3">
                      {section.explanation.map((paragraph, index) => (
                        <p
                          key={index}
                          className="leading-7 text-[var(--muted)]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        <section className="mt-12 panel rounded-3xl p-6">
          <h3 className="font-black">References</h3>

          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li>
              Database System Concepts, Silberschatz, Korth, Sudarshan.
            </li>
            <li>
              Fundamentals of Database Systems, Elmasri and Navathe.
            </li>
            <li>
              Stanford Database Systems course materials.
            </li>
          </ul>
        </section>
      </div>
    </SiteShell>
  );
}