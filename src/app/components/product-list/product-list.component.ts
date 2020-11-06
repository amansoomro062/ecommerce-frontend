import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../common/product';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();

    });
  }

  listProducts(): void{
    // check if "id" is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the id param string and covert string to a number using + symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      // cat id not available default to category 1
      this.currentCategoryId = 1;
    }
    // now get the products
    this.productService.getProductList(this.currentCategoryId).subscribe((data) => {
      this.products = data;
      console.log(data[0].imageUrl);
    });
  }

}
