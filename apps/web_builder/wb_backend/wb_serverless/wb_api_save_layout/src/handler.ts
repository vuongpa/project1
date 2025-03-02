import { APIGatewayProxyHandler } from "aws-lambda";
import { getConnectionOptions } from "@kis/common";
import { loadEnvConfig } from "@kis/common";
import { getAppDataSource } from "@kis/wb-data/dist/app-data-source";
import { LayoutEntity } from "@kis/wb-data/dist/entities";

export const saveLayout: APIGatewayProxyHandler = async (event) => {
  loadEnvConfig();

  try {
    // Parse dữ liệu từ request body
    const body = event.body ? JSON.parse(event.body) : null;
    if (!body || !body.name || !body.layout) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid request body. 'name' and 'layout' are required.",
        }),
      };
    }

    const { name, layout } = body;
    if (typeof name !== 'string' || typeof layout !== 'object') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid data. 'name' must be a string and 'layout' must be an object.",
        }),
      };
    }
    const appDataSource = getAppDataSource(getConnectionOptions());
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    const layoutRepository = appDataSource.getRepository(LayoutEntity);
    const existingLayout = await layoutRepository.findOne({ where: { name } });
    if (existingLayout) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: `Layout with name '${name}' already exists.`,
        }),
      };
    }
    const newLayout = new LayoutEntity();
    newLayout.name = name;
    newLayout.created_at = new Date();
    newLayout.updated_at = new Date();
    newLayout.layout = JSON.stringify(layout);
    await layoutRepository.save(newLayout);

    const savedLayout = {
      ...newLayout,
      layout: JSON.parse(newLayout.layout),
    };

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Layout saved successfully",
        layout: savedLayout,
      }),
    };
  } catch (error: any) {
    console.error("Error saving layout:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unable to save layout",
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