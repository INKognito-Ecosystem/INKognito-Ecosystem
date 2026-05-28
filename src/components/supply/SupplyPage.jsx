import NavbarSupply from './NavbarSupply'
import HeroSupply from './HeroSupply'
import CategoriesSupply from './CategoriesSupply'
import FeaturedProductssupply from './FeaturedProductssupply'
import BrandsSupply from './BrandsSupply'
import FooterSupply from './FooterSupply'

export default function SupplyPage() {

  return (

    <main className="bg-black text-white">
    
    <NavbarSupply />  

      <HeroSupply />
      
      <FeaturedProductssupply />

      <CategoriesSupply />

    <BrandsSupply />

    <FooterSupply />

    </main>

  )

}