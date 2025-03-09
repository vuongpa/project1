export const getColumnPropertiesDefaults = () => ({
    columnCount: 2, 
    width: "200px",
    height: "auto",
    padding: "10px",
    margin: "0px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    columnRatios: "1fr 1fr", 
  });
  export interface ColumnPropertiesDefaults {
    columnCount: number;
    width: string;
    height: string;
    padding: string;
    margin: string;
    backgroundColor: string;
    border: string;
    columnRatios: string;
  }