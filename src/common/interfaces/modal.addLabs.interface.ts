export interface ModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  paciente?: any;
  doctor?: any;
  onLaboratorioAdded?: (lab: any) => void;
  onPacienteRemoved?: (paciente: any) => void;
  onDoctorRemoved?: (doctor: any) => void;
  onAddPaciente?: (paciente: any) => void;
  onAddDoctor?: (doctor: any) => void;
}
