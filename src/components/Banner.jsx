import { Carousel, Image } from 'antd';
import Banner1 from 'assets/images/home-banner.jpg';
import Banner2 from 'assets/images/home-banner-2.jpg';
import Banner3 from 'assets/images/home-banner-3.jpg';

export default function Banner() {
  const images = [Banner1, Banner2, Banner3];
  return (
    <Carousel>
      {images.map((img, idx) => (
        <div key={idx}>
          <Image src={img} width='100%' alt='banner' preview={false} />
        </div>
      ))}
    </Carousel>
  );
}
