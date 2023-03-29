import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProductsService } from '../../products.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  images!: any[];
  product: any | null = null;

  suggestedProducts!: any[];

  public items!: MenuItem[];
  home!: MenuItem;

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  displayCustom!: boolean;

  activeIndex: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    private router: Router,
    private _productService: ProductsService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { product: any };
    if (state?.product) {
      this.product = state?.product;
      this.images = state?.product.images

      // Suggested products
      const productCategory = state?.product.category?.name;
      this._productService.getProductsByCategory(productCategory).subscribe((suggestedProducts: any) => {
        this.suggestedProducts = suggestedProducts.data.product;
        // Undefined when user reload the page or goes directly to this route
        console.log(this.suggestedProducts);
      })
    }
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];

    // If used navigated manually to the route
    if (!this.product) {
      this._productService.getProductById(id).subscribe((product: any) => {
        this.product = product.data.product[0];
        this.images = product.data.product[0].images;
        this.setBreadcrumbItems();

        // Suggested products
        const productCategory = product.data.product[0].category?.name;
        this._productService.getProductsByCategory(productCategory).subscribe((suggestedProducts: any) => {
          this.suggestedProducts = suggestedProducts.data.product;
          console.log('this.product value: ', this.product);

          console.log(this.suggestedProducts);
        })

      })
    } else {
      const productCategory = this.product.data?.product[0].category?.name;
      this._productService.getProductsByCategory(productCategory).subscribe((suggestedProducts: any) => {
        this.suggestedProducts = suggestedProducts.data.product;
        // Undefined when user reload the page or goes directly to this route
        console.log(this.suggestedProducts);
      })
    }

    // Breadcrumbs setup
    this.setBreadcrumbItems();
    this.home = { icon: 'pi pi-home', routerLink: '/home' };
  }

  navigateBack() {
    this._location.back();
  }

  // Move to service
  openProductDetails(id: number) {
    // TODO: find a Different way of doing this, this is only from preview -> details
    const product = {
      name: this.product.name,
      description: this.product.description,
      subcategory: this.product.subcategory,
      images: this.product.images,
      EAN: this.product.EAN,
      id,
      inStock: this.product.inStock,
      price: this.product.price
    }
    console.log(product);


    const navigationExtras: NavigationExtras = {
      state: {
        product
      }
    }
    this.router.navigate(['/products', id], navigationExtras);
  }

  getInstallmentPayAmount(price: number) {
    return Math.floor(price / 12);
  }

  setBreadcrumbItems() {
    this.items = [
      { label: 'Products', routerLink: '/products' },
      { label: `${this.product?.name}`, routerLink: `/products/${this.product?.id}` }
    ];
  }

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

}
