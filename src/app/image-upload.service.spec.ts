import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImageUploadService } from './image-upload.service';

describe('ImageUploadService', () => {
  let service: ImageUploadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImageUploadService]
    });
    service = TestBed.inject(ImageUploadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('imageUpload', () => {
    it('should upload an image successfully', () => {
      const image = new File(['test-image'], 'test.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', image);
      service.imageUpload(formData).subscribe(res => {
        expect(res).toEqual({ success: true });
      });

      const req = httpMock.expectOne('http://localhost:3000/api/v1/upload');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.get('image')).toBe(image);
      req.flush({ success: true });
    });

    it('should handle an error during image upload', () => {
      const image = new File(['test-image'], 'test.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', image);
      const errorMsg = 'Image upload failed';
      service.imageUpload(formData).subscribe(
        res => { },
        error => {
          expect(error.message).toBe(errorMsg);
        }
      );

      const req = httpMock.expectOne('http://localhost:3000/api/v1/upload');
      expect(req.request.method).toBe('POST');
      req.flush(errorMsg, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('multiImageUpload', () => {
    it('should upload multiple images successfully', () => {
      const image1 = new File(['test-image-1'], 'test1.png', { type: 'image/png' });
      const image2 = new File(['test-image-2'], 'test2.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('image1', image1);
      formData.append('image2', image2);
      service.multiImageUpload(formData).subscribe(res => {
        expect(res).toEqual({ success: true });
      });

      const req = httpMock.expectOne('http://localhost:3000/api/v1/upload-multiple');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.get('image1')).toBe(image1);
      expect(req.request.body.get('image2')).toBe(image2);
      req.flush({ success: true });
    });

  });
});
