import apiClient from "../api/client";

import type {
  Certification,
  CertificationApiResponse,
  CertificationMediaResponse,
  CreateCertificationPayload,
  DeleteCertificationMediaResponse,
  UpdateCertificationPayload,
} from "../types/certification";

const getCertifications = async (): Promise<
  Certification[]
> => {
  const response = await apiClient.get<
    CertificationApiResponse<Certification[]>
  >("/certifications");

  return response.data.data;
};

const createCertification = async (
  payload: CreateCertificationPayload
): Promise<Certification> => {
  const response = await apiClient.post<
    CertificationApiResponse<Certification>
  >("/certifications", payload);

  return response.data.data;
};

const updateCertification = async (
  id: string,
  payload: UpdateCertificationPayload
): Promise<Certification> => {
  const response = await apiClient.patch<
    CertificationApiResponse<Certification>
  >(`/certifications/${id}`, payload);

  return response.data.data;
};

const deleteCertification = async (
  id: string
): Promise<{
  id: string;
  cloudinary_cleanup_failed?: boolean;
}> => {
  const response = await apiClient.delete<
    CertificationApiResponse<{
      id: string;
      cloudinary_cleanup_failed?: boolean;
    }>
  >(`/certifications/${id}`);

  return response.data.data;
};

const uploadCertificationMedia = async (
  id: string,
  file: File
): Promise<CertificationMediaResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post<
    CertificationApiResponse<CertificationMediaResponse>
  >(
    `/certifications/${id}/media`,
    formData
  );

  return response.data.data;
};

const deleteCertificationMedia = async (
  id: string
): Promise<DeleteCertificationMediaResponse> => {
  const response = await apiClient.delete<
    CertificationApiResponse<DeleteCertificationMediaResponse>
  >(`/certifications/${id}/media`);

  return response.data.data;
};

export default {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  uploadCertificationMedia,
  deleteCertificationMedia,
};