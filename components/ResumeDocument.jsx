import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { splitBulletPoints } from "@/lib/constants";

// ATS-friendly resume generated from live portfolio data.
// Rules: single column, standard headings, Helvetica, real text only —
// no icons, images, tables or multi-column grids for parsers to trip on.

const INK = "#111111";
const MUTED = "#444444";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: INK,
    lineHeight: 1.45,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 10.5,
    color: MUTED,
    marginTop: 2,
  },
  contact: {
    fontSize: 9.5,
    color: MUTED,
    marginTop: 5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#999999",
    marginTop: 10,
    marginBottom: 2,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  itemTitle: {
    fontSize: 10.5,
    fontWeight: "bold",
  },
  itemMeta: {
    fontSize: 9.5,
    color: MUTED,
  },
  itemSub: {
    fontSize: 10,
    color: MUTED,
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingRight: 8,
  },
  bullet: {
    width: 12,
  },
  bulletText: {
    flex: 1,
  },
  body: {
    marginBottom: 2,
  },
  tech: {
    fontSize: 9.5,
    color: MUTED,
    marginTop: 1,
  },
  entry: {
    marginBottom: 8,
  },
});

const SectionTitle = ({ children }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

const Bullet = ({ children }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bullet}>{"•"}</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const formatMonth = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return date
    .toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
};

const dateRange = (item) => {
  const start = formatMonth(item.startDate);
  if (item.isCurrent) return `${start} – Present`;
  const end = formatMonth(item.endDate);
  return end ? `${start} – ${end}` : start;
};

export default function ResumeDocument({
  profile,
  summary,
  experience = [],
  education = [],
  projects = [],
  stack = [],
}) {
  return (
    <Document
      title={`${profile.name} — Resume`}
      author={profile.name}
      subject="Resume"
    >
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.name}>{profile.name.toUpperCase()}</Text>
        <Text style={styles.title}>Full Stack Developer</Text>
        <Text style={styles.contact}>
          {[
            profile.email,
            profile.phone,
            profile.location,
            profile.linkedin?.replace(/^https?:\/\/(www\.)?/, ""),
            profile.github?.replace(/^https?:\/\/(www\.)?/, ""),
          ]
            .filter(Boolean)
            .join("  |  ")}
        </Text>
        <View style={styles.divider} />

        {summary ? (
          <View style={styles.section}>
            <SectionTitle>SUMMARY</SectionTitle>
            <Text style={styles.body}>{summary}</Text>
          </View>
        ) : null}

        {experience.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>EXPERIENCE</SectionTitle>
            {experience.map((item) => (
              <View key={item.id || item.role} style={styles.entry} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.itemTitle}>
                    {item.role}
                    {item.employmentType ? ` — ${item.employmentType}` : ""}
                  </Text>
                  <Text style={styles.itemMeta}>{dateRange(item)}</Text>
                </View>
                <Text style={styles.itemSub}>
                  {[item.companyName, item.location].filter(Boolean).join(", ")}
                </Text>
                {item.description ? (
                  <Text style={styles.body}>{item.description}</Text>
                ) : null}
                {splitBulletPoints(item.responsibilities).map((point, i) => (
                  <Bullet key={i}>{point}</Bullet>
                ))}
              </View>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>PROJECTS</SectionTitle>
            {projects.map((project) => (
              <View key={project.id || project.title} style={styles.entry} wrap={false}>
                <Text style={styles.itemTitle}>{project.title}</Text>
                {project.tech?.length > 0 && (
                  <Text style={styles.tech}>{project.tech.join(", ")}</Text>
                )}
                {project.description ? (
                  <Text style={styles.body}>{project.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>EDUCATION</SectionTitle>
            {education.map((item) => (
              <View key={item.id || item.degree} style={styles.entry} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.itemTitle}>{item.degree}</Text>
                  <Text style={styles.itemMeta}>
                    {item.startYear} – {item.endYear}
                  </Text>
                </View>
                <Text style={styles.itemSub}>{item.institution}</Text>
                {item.description ? (
                  <Text style={styles.body}>{item.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {stack.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>SKILLS</SectionTitle>
            <Text style={styles.body}>{stack.join(" • ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
