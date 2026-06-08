import path from "path";
import { writeFile } from "fs/promises";
import {
  Presentation,
  PresentationFile,
  row,
  column,
  grid,
  text,
  rule,
  fill,
  hug,
  fixed,
  wrap,
  fr,
  auto,
} from "@oai/artifact-tool";

const workspaceDir = process.cwd();
const outputDir = path.join(workspaceDir, "output");
const scratchDir = path.join(workspaceDir, "scratch");

const slideSize = { width: 1920, height: 1080 };
const frame = { left: 0, top: 0, width: slideSize.width, height: slideSize.height };

const colors = {
  green: "#1C8B57",
  dark: "#163526",
  text: "#274036",
  muted: "#64756D",
  accent: "#E6F4EC",
  gold: "#D39A2C",
  softGold: "#F8F0DA",
  rose: "#F8E6E0",
  blue: "#E6F0FF",
};

const presentation = Presentation.create({ slideSize });

function titleStack(eyebrow, title, subtitle) {
  return column(
    {
      name: "title-stack",
      width: fill,
      height: hug,
      gap: 14,
    },
    [
      text(eyebrow, {
        name: "eyebrow",
        width: fill,
        height: hug,
        style: {
          fontSize: 22,
          bold: true,
          color: colors.green,
          allCaps: true,
          letterSpacing: 2.2,
        },
      }),
      text(title, {
        name: "slide-title",
        width: wrap(1360),
        height: hug,
        style: {
          fontSize: 58,
          bold: true,
          color: colors.dark,
        },
      }),
      rule({
        name: "title-rule",
        width: fixed(230),
        stroke: colors.green,
        weight: 5,
      }),
      text(subtitle, {
        name: "slide-subtitle",
        width: wrap(1380),
        height: hug,
        style: {
          fontSize: 26,
          color: colors.muted,
        },
      }),
    ],
  );
}

function sectionHeading(value, color = colors.green) {
  return text(value, {
    width: fill,
    height: hug,
    style: {
      fontSize: 26,
      bold: true,
      color,
    },
  });
}

function bulletList(items, maxWidth = 760) {
  return column(
    {
      width: fill,
      height: hug,
      gap: 12,
    },
    items.map((item, index) =>
      text(`- ${item}`, {
        name: `bullet-${index + 1}`,
        width: wrap(maxWidth),
        height: hug,
        style: {
          fontSize: 24,
          color: colors.text,
        },
      }),
    ),
  );
}

function smallNote(value) {
  return text(value, {
    width: fill,
    height: hug,
    style: {
      fontSize: 18,
      color: colors.muted,
    },
  });
}

function addSlide(content) {
  const slide = presentation.slides.add();
  slide.compose(content, { frame, baseUnit: 8 });
  return slide;
}

addSlide(
  grid(
    {
      name: "cover-root",
      width: fill,
      height: fill,
      columns: [fr(0.95), fr(1.35)],
      rows: [fr(1)],
      columnGap: 60,
      padding: { x: 88, y: 72 },
    },
    [
      column(
        {
          name: "cover-left",
          width: fill,
          height: fill,
          gap: 28,
        },
        [
          text("TRUST", {
            width: wrap(420),
            height: hug,
            style: {
              fontSize: 80,
              bold: true,
              color: colors.green,
            },
          }),
          text("Agro-consulting", {
            width: wrap(420),
            height: hug,
            style: {
              fontSize: 34,
              bold: true,
              color: colors.gold,
            },
          }),
          text("Trust Agro Management System", {
            width: wrap(540),
            height: hug,
            style: {
              fontSize: 28,
              bold: true,
              color: colors.green,
            },
          }),
          text("Consulting and Farming", {
            width: wrap(520),
            height: hug,
            style: {
              fontSize: 22,
              color: colors.muted,
            },
          }),
        ],
      ),
      column(
        {
          name: "cover-right",
          width: fill,
          height: fill,
          gap: 24,
        },
        [
          text("PHASE 1 FOUNDATION", {
            width: fill,
            height: hug,
            style: {
              fontSize: 24,
              bold: true,
              color: colors.green,
              allCaps: true,
              letterSpacing: 2.4,
            },
          }),
          text("Trust ERP System Presentation", {
            width: wrap(980),
            height: hug,
            style: {
              fontSize: 72,
              bold: true,
              color: colors.dark,
            },
          }),
          rule({
            width: fixed(280),
            stroke: colors.gold,
            weight: 6,
          }),
          text(
            "Focus areas for Weeks 1-2: user authentication and role-based access, plus farm management basic data entry.",
            {
              width: wrap(920),
              height: hug,
              style: {
                fontSize: 30,
                color: colors.text,
              },
            },
          ),
          text(
            "This deck explains what the current ERP system does, what Phase 1 includes, and why it matters for controlled operations and reliable farm records.",
            {
              width: wrap(930),
              height: hug,
              style: {
                fontSize: 24,
                color: colors.muted,
              },
            },
          ),
        ],
      ),
    ],
  ),
);

addSlide(
  column(
    {
      name: "overview-root",
      width: fill,
      height: fill,
      padding: { x: 88, y: 72 },
      gap: 34,
    },
    [
      titleStack(
        "ERP Overview",
        "What the Trust ERP system is designed to do",
        "A single operational platform for poultry and farm business activities.",
      ),
      grid(
        {
          width: fill,
          height: hug,
          columns: [fr(1), fr(1)],
          rows: [auto, auto],
          columnGap: 48,
          rowGap: 28,
        },
        [
          column(
            { width: fill, height: hug, gap: 14 },
            [
              sectionHeading("Core purpose"),
              bulletList([
                "Centralize daily farm work into one system instead of separate notebooks, files, and disconnected tools.",
                "Support poultry and agro operations with secure access, clean records, and a structure for future reporting.",
                "Create a strong base for modules such as flocks, veterinary, pharmacy, inventory, CRM, and finance.",
              ]),
            ],
          ),
          column(
            { width: fill, height: hug, gap: 14 },
            [
              sectionHeading("Current platform direction", colors.gold),
              bulletList([
                "Authentication endpoints are available for login and current-user retrieval.",
                "Role-based access is defined for administrators, managers, veterinary, finance, store, pharmacy, and extension teams.",
                "Farm records can already be created and maintained through the frontend and backend modules.",
              ]),
            ],
          ),
          column(
            { width: fill, height: hug, gap: 14 },
            [
              sectionHeading("Why ERP matters"),
              bulletList([
                "Improves visibility across operations.",
                "Standardizes data entry and ownership.",
                "Reduces manual errors and duplicate work.",
              ]),
            ],
          ),
          column(
            { width: fill, height: hug, gap: 14 },
            [
              sectionHeading("Phase 1 outcome", colors.gold),
              bulletList([
                "Secure sign-in and user access structure.",
                "Basic farm master-data entry.",
                "A launchpad for controlled scaling into later phases.",
              ]),
            ],
          ),
        ],
      ),
    ],
  ),
);

addSlide(
  column(
    {
      name: "scope-root",
      width: fill,
      height: fill,
      padding: { x: 88, y: 72 },
      gap: 34,
    },
    [
      titleStack(
        "Phase 1 Scope",
        "Weeks 1-2 focus on two foundation capabilities",
        "These are the minimum controls needed to start operating the ERP in a structured way.",
      ),
      grid(
        {
          width: fill,
          height: hug,
          columns: [fr(1), fr(1)],
          rows: [auto],
          columnGap: 56,
        },
        [
          column(
            { width: fill, height: hug, gap: 16 },
            [
              sectionHeading("1. User authentication and roles"),
              bulletList([
                "Users log in through the authentication module.",
                "Protected API routes require authenticated access.",
                "Role definitions establish who can manage which business functions.",
              ], 760),
              smallNote("Foundation for secure access and accountability."),
            ],
          ),
          column(
            { width: fill, height: hug, gap: 16 },
            [
              sectionHeading("2. Farm management module", colors.gold),
              bulletList([
                "Basic farm data can be entered and updated through the farm form and farm backend service.",
                "Key fields cover farm name, location, type, capacity, and assigned manager.",
                "This creates a controlled starting point for all later flock and production work.",
              ], 760),
              smallNote("Foundation for master data consistency."),
            ],
          ),
        ],
      ),
      text("Phase 1 is about readiness, not full ERP maturity.", {
        width: wrap(980),
        height: hug,
        style: {
          fontSize: 34,
          bold: true,
          color: colors.dark,
        },
      }),
    ],
  ),
);

addSlide(
  column(
    {
      name: "auth-root",
      width: fill,
      height: fill,
      padding: { x: 88, y: 72 },
      gap: 26,
    },
    [
      titleStack(
        "Capability 1",
        "User authentication and role-based access",
        "The ERP already includes the key building blocks for secure sign-in and controlled usage.",
      ),
      grid(
        {
          width: fill,
          height: hug,
          columns: [fr(1.05), fr(0.95)],
          rows: [auto, auto],
          columnGap: 44,
          rowGap: 18,
        },
        [
          column(
            { width: fill, height: hug, gap: 14 },
            [
              sectionHeading("What is implemented"),
              bulletList([
                "Login endpoint is available in the authentication controller.",
                "Current user lookup is available for signed-in sessions.",
                "Security configuration protects all non-login API routes.",
                "Password handling uses BCrypt encoding for stronger credential security.",
              ], 780),
            ],
          ),
          column(
            { width: fill, height: hug, gap: 14 },
            [
              sectionHeading("Role structure", colors.gold),
              bulletList([
                "Administration: ADMIN",
                "Management: GENERAL_MANAGER, OPERATIONS_MANAGER, FARM_MANAGER",
                "Operations support: VETERINARY_OFFICER, STORE_KEEPER, PHARMACY_SALES",
                "Business support: FINANCE_OFFICER and EXTENSION_WORKER",
              ], 620),
            ],
          ),
          column(
            { width: fill, height: hug, gap: 14, columnSpan: 2 },
            [
              sectionHeading("Business value"),
              bulletList([
                "Only approved users can access the system.",
                "Different job functions can be separated by role.",
                "The ERP is ready for tighter module-level permissions as the project grows.",
              ], 1400),
              smallNote("Project evidence: AuthController, SecurityConfig, and Role enum in the backend project."),
            ],
          ),
        ],
      ),
    ],
  ),
);

addSlide(
  column(
    {
      name: "farm-root",
      width: fill,
      height: fill,
      padding: { x: 88, y: 72 },
      gap: 34,
    },
    [
      titleStack(
        "Capability 2",
        "Farm management module for basic data entry",
        "The ERP includes the farm data model, backend endpoints, and a frontend farm form.",
      ),
      grid(
        {
          width: fill,
          height: hug,
          columns: [fr(1), fr(1)],
          rows: [auto, auto],
          columnGap: 46,
          rowGap: 26,
        },
        [
          column(
            { width: fill, height: hug, gap: 14 },
            [
              sectionHeading("Data captured"),
              bulletList([
                "Farm name",
                "Location",
                "Farm type",
                "Capacity",
                "Assigned farm manager",
              ], 680),
            ],
          ),
          column(
            { width: fill, height: hug, gap: 14 },
            [
              sectionHeading("How it works", colors.gold),
              bulletList([
                "Users can create and edit farms in the frontend farm form.",
                "The backend validates the incoming farm request data.",
                "Farm records become the master reference for later flock and operational activity.",
              ], 760),
            ],
          ),
          column(
            { width: fill, height: hug, gap: 14, columnSpan: 2 },
            [
              sectionHeading("Why this matters"),
              bulletList([
                "Standardized farm records reduce confusion across locations and teams.",
                "Capacity and ownership data support planning and oversight.",
                "Farm setup is a necessary base before scaling production, veterinary, and inventory workflows.",
              ], 1400),
              smallNote("Project evidence: FarmController, FarmRequest, and FarmForm in the current ERP project."),
            ],
          ),
        ],
      ),
    ],
  ),
);

addSlide(
  column(
    {
      name: "value-root",
      width: fill,
      height: fill,
      padding: { x: 88, y: 72 },
      gap: 34,
    },
    [
      titleStack(
        "Phase 1 Value",
        "What the business gains from this foundation",
        "Even a small first phase creates meaningful operational control.",
      ),
      row(
        {
          width: fill,
          height: hug,
          gap: 48,
        },
        [
          column(
            { width: fill, height: hug, gap: 18 },
            [
              sectionHeading("Control"),
              bulletList([
                "Secures system access through authentication.",
                "Introduces role-aware responsibility boundaries.",
              ], 560),
              sectionHeading("Consistency", colors.gold),
              bulletList([
                "Creates one standard way to register farm information.",
                "Improves data reliability for future modules and reports.",
              ], 560),
            ],
          ),
          column(
            { width: fill, height: hug, gap: 18 },
            [
              sectionHeading("Readiness"),
              bulletList([
                "Makes it easier to add flocks, inventory, veterinary, and finance workflows next.",
                "Supports cleaner expansion than building each module in isolation.",
              ], 560),
              sectionHeading("Confidence", colors.gold),
              bulletList([
                "Shows stakeholders that the ERP already has real structure, not just a UI shell.",
                "Creates a visible starting point for adoption and process discipline.",
              ], 560),
            ],
          ),
        ],
      ),
      text("Phase 1 turns the ERP into an operationally credible foundation.", {
        width: wrap(1280),
        height: hug,
        style: {
          fontSize: 36,
          bold: true,
          color: colors.dark,
        },
      }),
    ],
  ),
);

addSlide(
  column(
    {
      name: "next-root",
      width: fill,
      height: fill,
      padding: { x: 88, y: 72 },
      gap: 34,
    },
    [
      titleStack(
        "Next Steps",
        "What can follow after Phase 1",
        "The current foundation is positioned to support broader ERP growth.",
      ),
      grid(
        {
          width: fill,
          height: hug,
          columns: [fr(1), fr(1)],
          rows: [auto, auto],
          columnGap: 50,
          rowGap: 24,
        },
        [
          column(
            { width: fill, height: hug, gap: 14 },
            [
              sectionHeading("Operational expansion"),
              bulletList([
                "Flock registration and production tracking",
                "Inventory movement and stock control",
                "Veterinary treatment and health issue workflows",
              ], 720),
            ],
          ),
          column(
            { width: fill, height: hug, gap: 14 },
            [
              sectionHeading("Business expansion", colors.gold),
              bulletList([
                "Finance and sales analysis",
                "CRM and farm visit records",
                "Reports and decision dashboards",
              ], 720),
            ],
          ),
          column(
            { width: fill, height: hug, gap: 14, columnSpan: 2 },
            [
              sectionHeading("Recommended message for stakeholders"),
              bulletList([
                "Phase 1 is already aligned with the ERP foundation goals.",
                "The current system has secure access, role definitions, and farm master-data capability.",
                "The project is ready to continue into deeper operational modules with less risk.",
              ], 1420),
              text("Thank you", {
                width: fill,
                height: hug,
                style: {
                  fontSize: 42,
                  bold: true,
                  color: colors.green,
                },
              }),
            ],
          ),
        ],
      ),
    ],
  ),
);

const pptxBlob = await PresentationFile.exportPptx(presentation);
await pptxBlob.save(path.join(outputDir, "output.pptx"));

for (let index = 0; index < presentation.slides.count; index += 1) {
  const slide = presentation.slides.getItem(index);
  presentation.slides.setActive(slide);
  const pngBlob = await presentation.export({ format: "png" });
  const slideName = `slide-${String(index + 1).padStart(2, "0")}.png`;
  const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
  await writeFile(path.join(scratchDir, slideName), pngBuffer);
}
