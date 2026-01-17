import { Test, TestingModule } from '@nestjs/testing';
import { ProxyService } from './proxy.service';
import axios from 'axios';

// Mock completo para axios con create
jest.mock('axios');

// Crear mock antes de cualquier test
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};

(axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

describe('ProxyService', () => {
  let service: ProxyService;

  beforeEach(async () => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProxyService],
    }).compile();

    service = module.get<ProxyService>(ProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

it('should forward GET request', async () => {
    const mockData = { id: 1, name: 'Test' };
    
    // Configurar el mock para este test específico
    mockAxiosInstance.get.mockResolvedValue({ 
      data: mockData,
      status: 200 
    });

    const result = await service.forwardRequest(
      'GET',
      'http://localhost:3001/test',
    );
    
    expect(result).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      'http://localhost:3001/test',
      { headers: {} }
    );
  });
});
