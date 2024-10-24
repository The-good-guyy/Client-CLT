import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import FormHelperText from '@mui/joy/FormHelperText';
import Stack from '@mui/material/Stack';
import AspectRatio from '@mui/joy/AspectRatio';
import IconButton from '@mui/joy/IconButton';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import FormLabel from '@mui/joy/FormLabel';
import FormControl from '@mui/joy/FormControl';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Option from '@mui/joy/Option';
import { getErrorMessage } from '@/libs/common/utils/error';
import axios, { AxiosError } from 'axios';
import {
  assignRole,
  getAllRoles,
  getUserById,
} from '@/libs/common/utils/fetch';
const validationSchema = Yup.object({
  roleId: Yup.string(),
});
export default function AssignRoleModal({
  open,
  setOpen,
  id,
  setSelectedId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const queryClient = useQueryClient();
  const { isPending, isError, data, error, isSuccess } = useQuery({
    queryKey: ['user', { id: id }],
    queryFn: () => getUserById(id),
    retry: false,
    retryOnMount: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!id && open,
  });
  const fetchRole = useQuery({
    queryKey: ['roles'],
    queryFn: () => getAllRoles(),
    retry: false,
    retryOnMount: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!id && open,
  });
  const mutation = useMutation({
    mutationFn: assignRole,
    onSuccess: (data) => {
      queryClient.setQueryData(['user', { id: data.id }], data),
        queryClient.invalidateQueries({
          queryKey: ['users'],
        }),
        toast.success('User Updated successfully'),
        setSelectedId('');
      setOpen(false);
    },
    onError: (error: Error | AxiosError) => {
      setSelectedId('');
      setOpen(false);
      if (axios.isAxiosError(error)) {
        toast.error(getErrorMessage(error?.response?.data));
      } else {
        toast.error(getErrorMessage(error));
      }
    },
  });
  const formik = useFormik({
    initialValues: {
      roleId: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      if (!values.roleId || values.roleId === data?.role?.id) {
        setSelectedId('');
        setOpen(false);
        return;
      }
      mutation.mutate({ id: id, roleId: values.roleId });
    },
  });
  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false), setSelectedId('');
        }}
      >
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>Update User</DialogTitle>
          <Divider />
          {isSuccess && data && (
            <form onSubmit={formik.handleSubmit} id="udpatedForm">
              <Stack
                direction="row"
                spacing={3}
                sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
              >
                <Stack direction="column" spacing={1}>
                  <AspectRatio
                    ratio="1"
                    maxHeight={200}
                    sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}
                  >
                    <img
                      src={
                        data?.profileImage ||
                        'https://firebasestorage.googleapis.com/v0/b/mern-blog-project-28a14.appspot.com/o/profileImage.jpg?alt=media&token=4b00eeb1-6eb8-4c2d-9ba5-1c5fcf7e3d49'
                      }
                      srcSet={
                        data?.profileImage ||
                        'https://firebasestorage.googleapis.com/v0/b/mern-blog-project-28a14.appspot.com/o/profileImage.jpg?alt=media&token=4b00eeb1-6eb8-4c2d-9ba5-1c5fcf7e3d49'
                      }
                      loading="lazy"
                      alt=""
                    />
                  </AspectRatio>
                  <IconButton
                    aria-label="upload new picture"
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      bgcolor: 'background.body',
                      position: 'absolute',
                      zIndex: 2,
                      borderRadius: '50%',
                      left: 100,
                      top: 170,
                      boxShadow: 'sm',
                    }}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </Stack>
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Stack spacing={1}>
                    <FormLabel>Id</FormLabel>
                    <FormControl
                      sx={{
                        display: { sm: 'flex-column', md: 'flex-row' },
                        gap: 2,
                      }}
                    >
                      <Input
                        size="sm"
                        placeholder="Id"
                        defaultValue={data?.id}
                        disabled
                      />
                    </FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <Input
                        size="sm"
                        placeholder="Username"
                        id="username"
                        name="username"
                        defaultValue={data?.username}
                        disabled
                      />
                    </FormControl>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <FormLabel>isVerified</FormLabel>
                      <Input
                        size="sm"
                        placeholder="isVerified"
                        id="isVerified"
                        name="isVerified"
                        defaultValue={data?.isVerified}
                        disabled
                      />
                    </FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <FormLabel>Role</FormLabel>
                      <Select
                        size="sm"
                        id="roleId"
                        name="roleId"
                        onBlur={formik.handleBlur}
                        defaultValue={data?.role?.id}
                        onChange={(event, value) => {
                          formik.setFieldValue('roleId', value);
                        }}
                        color={
                          formik.touched.roleId && Boolean(formik.errors.roleId)
                            ? 'danger'
                            : 'neutral'
                        }
                        disabled={mutation.isPending}
                      >
                        {fetchRole.isSuccess &&
                          fetchRole.data.roles.map(
                            (r: { id: string; role: string }) => (
                              <Option key={r.id} value={r.id}>
                                {r.role}
                              </Option>
                            )
                          )}
                      </Select>
                      {formik.touched.roleId &&
                        Boolean(formik.errors.roleId) && (
                          <FormHelperText>
                            {formik.errors.roleId}
                          </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl sx={{ width: '50%' }}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        size="sm"
                        type="email"
                        startDecorator={<EmailRoundedIcon />}
                        placeholder="email"
                        defaultValue={data?.email}
                        sx={{ flexGrow: 1 }}
                        disabled
                      />
                    </FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <FormControl>
                      <FormLabel>CreatedAt</FormLabel>
                      <Input
                        size="sm"
                        defaultValue={data?.createdAt}
                        disabled
                      />
                    </FormControl>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <FormLabel>UpdatedAt</FormLabel>
                      <Input
                        size="sm"
                        defaultValue={data?.updatedAt}
                        disabled
                      />
                    </FormControl>
                  </Stack>
                </Stack>
              </Stack>
            </form>
          )}

          <DialogActions>
            <Button
              form="udpatedForm"
              sx={{ backgroundColor: '#000000' }}
              variant="solid"
              color="neutral"
              type="submit"
              disabled={isPending || mutation.isPending}
            >
              Update
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => {
                setOpen(false), setSelectedId('');
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
