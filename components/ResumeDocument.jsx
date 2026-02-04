import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

const blue = '#1f6feb';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },

  header: {
    fontSize: 20,
    fontWeight: 'bold'
  },

  contact: {
    marginTop: 4,
    color: '#555'
  },

  divider: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },

  section: {
    marginTop: 12
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: blue,
    marginBottom: 6
  },

  itemTitle: {
    fontSize: 10,
    fontWeight: 'bold'
  },

  subText: {
    color: '#555',
    marginBottom: 4
  },

  projectGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  projectCol: {
    width: '48%'
  },

  link: {
    color: blue,
    textDecoration: 'none'
  },

  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  skill: {
    width: '33%',
    marginBottom: 4
  }
});

export default function InternshalaResume() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <Text style={styles.header}>Rohit Kumar</Text>
        <Text style={styles.contact}>
          rk34190100@gmail.com | +91 9113190285 | Kolkata
        </Text>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CAREER OBJECTIVE</Text>
          <Text>
            Enthusiastic B.Tech 3rd year student with hands-on experience in web development,
            seeking industry exposure to build scalable and impactful products.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>

          <Text style={styles.itemTitle}>
            B.Tech, Chemical Technology (2023 – 2027)
          </Text>
          <Text style={styles.subText}>University of Calcutta</Text>

          <Text style={styles.itemTitle}>
            Senior Secondary (XII) – 2022
          </Text>
          <Text style={styles.subText}>
            Purnea College, Purnea | 67.80%
          </Text>

          <Text style={styles.itemTitle}>
            Secondary (X) – 2020
          </Text>
          <Text style={styles.subText}>
            Shri Darwari Roy High School | 80%
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PORTFOLIO</Text>
          <Link src="https://your-portfolio-link" style={styles.link}>
            Portfolio link ↗
          </Link>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROJECTS</Text>

          <View style={styles.projectGrid}>
            <View style={styles.projectCol}>
              <Text style={styles.itemTitle}>AI Article Summariser</Text>
              <Text style={styles.subText}>Nov 2025 – Dec 2025</Text>
              <Text>
                NLP-based summarization tool using transformer models.
                Built with React, supports URL input and history storage.
              </Text>
            </View>

            <View style={styles.projectCol}>
              <Text style={styles.itemTitle}>Vaartalap</Text>
              <Text style={styles.subText}>Jun 2025 – Present</Text>
              <Text>
                Real-time chat app with one-to-one messaging, video calls,
                group chat, friend system, and status updates.
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 8 }} />

          <View style={styles.projectGrid}>
            <View style={styles.projectCol}>
              <Text style={styles.itemTitle}>File Sharing Web App</Text>
              <Text style={styles.subText}>Aug 2025 – Present</Text>
              <Text>
                Peer-to-peer file sharing using WebRTC and Socket.IO
                without third-party storage.
              </Text>
            </View>

            <View style={styles.projectCol}>
              <Text style={styles.itemTitle}>GigaDB</Text>
              <Text style={styles.subText}>Dec 2025 – Present</Text>
              <Text>
                Custom append-only database in Node.js with API key auth,
                indexing, and REST access.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SKILLS</Text>

          <View style={styles.skillRow}>
            <Text style={styles.skill}>JavaScript</Text>
            <Text style={styles.skill}>React</Text>
            <Text style={styles.skill}>Node.js</Text>
            <Text style={styles.skill}>Express.js</Text>
            <Text style={styles.skill}>MongoDB</Text>
            <Text style={styles.skill}>MySQL</Text>
            <Text style={styles.skill}>Socket.IO</Text>
            <Text style={styles.skill}>HTML</Text>
            <Text style={styles.skill}>CSS</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
