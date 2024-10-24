export const mockSiteData = {
  status_code: 200,
  message: 'Site Data information get success.',
  site_data: [
    {
      site_id: '11111111-1111-1111-1111-111111111111',
      data_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      visibility: 'public',
      key: 'site_data_keyA',
      type: { type: 'number' },
      value: 100.01,
      description: 'This is site_data_keyA.',
      create_user: 'user-001',
      create_date: '2024-06-18T12:22:34.024',
      create_user_name: 'John Doe',
      update_user: 'user-002',
      update_date: '2024-06-18T12:22:34.024',
      update_user_name: 'Jane Smith',
    },
    {
      site_id: '22222222-2222-2222-2222-222222222222',
      data_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      visibility: 'organization',
      key: 'site_data_keyB',
      type: { type: 'number' },
      value: 200.02,
      description: 'This is site_data_keyB.',
      create_user: 'user-003',
      create_date: '2024-07-01T09:00:00.000',
      create_user_name: 'Alice Johnson',
      update_user: 'user-004',
      update_date: '2024-07-02T10:30:00.000',
      update_user_name: 'Bob Lee',
    },
    {
      site_id: '33333333-3333-3333-3333-333333333333',
      data_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      visibility: 'private',
      key: 'site_data_keyC',
      type: { type: 'string' },
      value: 'example_value_C',
      description: 'This is site_data_keyC.',
      create_user: 'user-005',
      create_date: '2024-08-05T10:00:00.000',
      create_user_name: 'Charlie Brown',
      update_user: 'user-006',
      update_date: '2024-08-06T11:15:00.000',
      update_user_name: 'Emily Davis',
    },
    {
      site_id: '44444444-4444-4444-4444-444444444444',
      data_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      visibility: 'public',
      key: 'site_data_keyD',
      type: { type: 'boolean' },
      value: true,
      description: 'This is site_data_keyD.',
      create_user: 'user-007',
      create_date: '2024-09-10T08:45:00.000',
      create_user_name: 'David Clark',
      update_user: 'user-008',
      update_date: '2024-09-11T09:55:00.000',
      update_user_name: 'Fiona Green',
    },
    {
      site_id: '55555555-5555-5555-5555-555555555555',
      data_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      visibility: 'organization',
      key: 'site_data_keyE',
      type: { type: 'number' },
      value: 300.03,
      description: 'This is site_data_keyE.',
      create_user: 'user-009',
      create_date: '2024-09-15T12:00:00.000',
      create_user_name: 'George White',
      update_user: 'user-010',
      update_date: '2024-09-16T13:10:00.000',
      update_user_name: 'Hannah Black',
    },
    {
      site_id: '66666666-6666-6666-6666-666666666666',
      data_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      visibility: 'private',
      key: 'site_data_keyF',
      type: { type: 'string' },
      value: 'example_value_F',
      description: 'This is site_data_keyF.',
      create_user: 'user-011',
      create_date: '2024-10-01T15:45:00.000',
      create_user_name: 'Ivy Thompson',
      update_user: 'user-012',
      update_date: '2024-10-02T16:55:00.000',
      update_user_name: 'Jack Martin',
    },
    {
      site_id: '77777777-7777-7777-7777-777777777777',
      data_id: 'gggggggg-gggg-gggg-gggg-gggggggggggg',
      visibility: 'public',
      key: 'site_data_keyG',
      type: { type: 'boolean' },
      value: false,
      description: 'This is site_data_keyG.',
      create_user: 'user-013',
      create_date: '2024-10-10T17:00:00.000',
      create_user_name: 'Karen Clark',
      update_user: 'user-014',
      update_date: '2024-10-11T18:10:00.000',
      update_user_name: 'Liam Scott',
    },
  ],
}