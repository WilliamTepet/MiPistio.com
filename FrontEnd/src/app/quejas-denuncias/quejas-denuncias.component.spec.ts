import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuejasDenunciasComponent } from './quejas-denuncias.component';

describe('QuejasDenunciasComponent', () => {
  let component: QuejasDenunciasComponent;
  let fixture: ComponentFixture<QuejasDenunciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuejasDenunciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuejasDenunciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
