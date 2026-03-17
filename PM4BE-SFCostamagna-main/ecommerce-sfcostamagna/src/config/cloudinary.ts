import { v2 as cloudinary } from 'cloudinary';
import { environment } from '../config/environment';
export const CloudinaryConfig = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: environment.CLOUDINARY_CLOUD_NAME,
      apy_key: environment.CLOUDINARY_APY_KEY,
      apy_secret: environment.CLOUDINARY_APY_SECRET,
    });
  },
};
