import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontSize: 12,
    padding: "30px 50px",
    fontFamily: "Helvetica", // Default font
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold", // Use the bold font here
  },
  textBold: {
    fontFamily: "Helvetica-Bold", // Set this to bold variant
  },
});
