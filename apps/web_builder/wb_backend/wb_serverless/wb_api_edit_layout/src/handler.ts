import { APIGatewayProxyHandler } from "aws-lambda";
import { getConnectionOptions } from "@kis/common";
import { loadEnvConfig } from "@kis/common";
import { getAppDataSource } from "@kis/wb-data/dist/app-data-source";
import { LayoutEntity } from "@kis/wb-data/dist/entities";

export const editLayout: APIGatewayProxyHandler = async (event) => {
  loadEnvConfig();

  try {
    const layoutId = event.queryStringParameters?.id;
    if (!layoutId || isNaN(parseInt(layoutId))) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid layout ID. Please provide a valid numeric ID.",
        }),
      };
    }
    const body = event.body ? JSON.parse(event.body) : null;
    if (!body || !body.name || !body.layout) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "invalid",
        }),
      };
    }
    const { name, layout } = body;
    if (typeof name !== 'string' || typeof layout !== 'object') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "invalid",
        }),
      };
    }
    const appDataSource = getAppDataSource(getConnectionOptions());
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    const layoutRepository = appDataSource.getRepository(LayoutEntity);
    const existingLayout = await layoutRepository.findOne({ where: { id: parseInt(layoutId) } });
    if (!existingLayout) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Layout with ID ${layoutId} not found.`,
        }),
      };
    }
    existingLayout.name = name;
    existingLayout.layout = JSON.stringify(layout);
    existingLayout.updated_at = new Date();
    await layoutRepository.save(existingLayout);
    const updatedLayout = {
      ...existingLayout,
      layout: JSON.parse(existingLayout.layout),
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Layout with ID ${layoutId} updated successfully.`,
        layout: updatedLayout,
      }),
    };
  } catch (error: any) {
    console.error("Error updating layout:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unable to update layout",
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