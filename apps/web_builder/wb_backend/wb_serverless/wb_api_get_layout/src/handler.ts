import { APIGatewayProxyHandler } from "aws-lambda";
import { getConnectionOptions } from "@kis/common";
import { loadEnvConfig } from "@kis/common";
import { getAppDataSource } from "@kis/wb-data/dist/app-data-source";
import { LayoutEntity } from "@kis/wb-data/dist/entities";

export const getLayouts: APIGatewayProxyHandler = async () => {
  loadEnvConfig();

  try {
    const appDataSource = getAppDataSource(getConnectionOptions());
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    const layouts = await appDataSource.getRepository(LayoutEntity).find();
    if (!layouts || layouts.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No layouts found" }),
      };
    }
    const parsedLayouts = layouts.map((layout) => ({
      ...layout,
      layout: typeof layout.layout === 'string' ? JSON.parse(layout.layout) : layout.layout,
    }));
    return {
      statusCode: 200,
      body: JSON.stringify(parsedLayouts),
    };
  } catch (error: any) {
    console.error("Error fetching layouts:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unable to fetch layouts",
        details: error.message,
      }),
    };
  } finally {
    const appDataSource = getAppDataSource(getConnectionOptions());
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
    }
  }
};