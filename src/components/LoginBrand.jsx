import { Image } from 'antd';
import BrandFullBlueTransparent from 'assets/images/brand-full-blue-transparent.png';

export default function LoginBrand({ ...imgProps }) {
  return (
    <>
      <Image
        {...imgProps}
        preview={false}
        src={BrandFullBlueTransparent}
        alt='Smatyx logo'
        width={300}
      />
    </>
  );
}
