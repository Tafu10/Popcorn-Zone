import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header'; // Asigură-te că importă clasa corectă
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent, 
        HttpClientTestingModule, // Pentru AuthService
        RouterTestingModule      // Pentru Router
      ],
      providers: [AuthService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});