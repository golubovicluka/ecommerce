import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './Product';
import { ProductsService } from './products.service';
import { SubscriptionContainer } from './SubscriptionContainer';

@Component({
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.scss'],
})
export class ProductsViewComponent implements OnInit, OnDestroy {
  products$!: Observable<any>
  subs = new SubscriptionContainer();
  selectedCategory: string = "Phone";

  constructor(private _productService: ProductsService) { }

  ngOnInit() {
    this._productService.getProducts().subscribe((products: any) => {
      console.log(products.data.product);
      this.products$ = of(products.data.product);
    });
  }

  trackByProductId(index: number, product: Product): number {
    return index;
  }

  getByCategory(selectedCategory: string) {
    this._productService.getProductByCategory(selectedCategory).subscribe((products: any) => {
      console.log(`Products in category ${selectedCategory}: `, products);
      this.products$ = of(products.data.product);
    })
  }

  ngOnDestroy() {
    this.subs?.dispose()
  }

  filterCategories(categories: string[]) {
    this._productService.getProductsFromCategories(categories).subscribe((products: any) => {
      this.products$ = of(products.data.product)
    })
  }

}
