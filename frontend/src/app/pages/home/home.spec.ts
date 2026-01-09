import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';
import { MovieService } from '../../services/movie';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  // Creăm un serviciu fals (mock) care returnează o listă goală, ca să nu cerem date reale în teste
  const movieServiceMock = {
    getAllMovies: () => of([]) 
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule],
      providers: [
        { provide: MovieService, useValue: movieServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});