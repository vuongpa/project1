import { APIGatewayProxyHandler } from "aws-lambda";
import { getConnectionOptions } from "@kis/common";
import { loadEnvConfig } from "@kis/common";
import { getAppDataSource } from "@kis/wb-data/dist/app-data-source";
import { LayoutEntity } from "@kis/wb-data/dist/entities";

export const deleteLayout: APIGatewayProxyHandler = async (event) => {
  loadEnvConfig();

  try {
    // Lấy id từ query parameter
    const layoutId = event.queryStringParameters?.id;
    if (!layoutId || isNaN(parseInt(layoutId))) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid layout ID. Please provide a valid numeric ID.",
        }),
      };
    }

    // Khởi tạo kết nối cơ sở dữ liệu
    const appDataSource = getAppDataSource(getConnectionOptions());
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    const layoutRepository = appDataSource.getRepository(LayoutEntity);

    // Tìm layout với id
    const layout = await layoutRepository.findOne({ where: { id: parseInt(layoutId) } });
    if (!layout) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Layout with ID ${layoutId} not found.`,
        }),
      };
    }

    // Xóa layout
    await layoutRepository.remove(layout);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Layout with ID ${layoutId} deleted successfully.`,
      }),
    };
  } catch (error: any) {
    console.error("Error deleting layout:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unable to delete layout",
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