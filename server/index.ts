
import Kernel from "./kernel";

import logger from "./utils/logger";

const PORT = Kernel.get('PORT');

Kernel.listen(Kernel.get('PORT'), () => {
    logger.info(`Server is running on PORT http://localhost:${PORT}`)
})