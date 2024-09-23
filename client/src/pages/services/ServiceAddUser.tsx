import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { useAddUserToServiceMutation, useGetServiceByIdQuery } from '../../store/api/serviceSlice';
import { useGetUsersByRoleQuery } from '../../store/api/userSlice';
import Select from 'react-select';
import FormContainer from '../../components/containers/Form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

type ServiceUser = {
  userId: number;
  serviceId: number;
  user: User;
};

type ServiceResponse = {
  id: number;
  name: string;
  facultyId: number;
  users: ServiceUser[];
};

const ServiceAddUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const serviceId = parseInt(id!, 10);

  const { data: serviceData } = useGetServiceByIdQuery(serviceId);
  // @ts-ignore
  const service: ServiceResponse | undefined = serviceData?.[0]; 

  const { data: usersData } = useGetUsersByRoleQuery('service');

  const availableUsers = usersData?.users.filter(
    (user) => !service?.users.some((serviceUser) => serviceUser.userId === user.id)
  );

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);

  const [addUserToService] = useAddUserToServiceMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabled(true);

    if (selectedUser) {
      try {
        // Add the selected user to the service
        await addUserToService({ userId: selectedUser.value, serviceId });
        navigate(-1);
        setSelectedUser(null);
        setDisabled(false);
      } catch (error) {
        console.error('Грешка при додавању корисника у службу:', error);
        setDisabled(false);
      }
    }
  };

  // Prepare user options for the select input
  const userOptions = availableUsers?.map((user) => ({
    value: user.id,
    label: `${user.name} (${user.username})`,
  }));

  return (
    <MainLayout>
      <div className="w-full h-screen grid place-items-center bg-secondary-custom overflow-y-scroll">
        <FormContainer>
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-y-4">
              
              {/* Input for service name (disabled) */}
              <Input
                id="service-name"
                type='text'
                label="Назив службе"
                value={service?.name || ''}
                disabled={true}
              />
              
              {/* React Select for choosing a user */}
              <div>
                <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Изаберите корисника за службу
                </label>
                <Select
                  id="user-select"
                  options={userOptions}
                  value={selectedUser}
                  onChange={setSelectedUser}
                  placeholder="Изаберите корисника..."
                  isClearable
                />
              </div>
              
              {/* Submit button */}
              <Button type="submit" disabled={!selectedUser || disabled}>
                Додај Корисника
              </Button>
            </div>
          </form>
        </FormContainer>
      </div>
    </MainLayout>
  );
};

export default ServiceAddUser;
