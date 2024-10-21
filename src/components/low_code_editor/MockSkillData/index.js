// モックデータ
export const mockSkills = {
  status_code: 200,
  message: 'Skills information get success.',
  skills: [
    // v1.0 グループ
    {
      id: '11111111-1111-1111-1111-111111111111',
      organization_id: 'org-1234',
      name: 'Arm Control',
      description: 'This skill allows precise control of the robotic arm.',
      schema: {
        type: 'object',
        Node: {
          type: 'string',
          enum: 'ARM_CONTROL',
        },
        '@destination': {
          type: ['array', 'null'],
          items: {
            type: 'number',
          },
          minItems: 3,
          maxItems: 10,
        },
        '@frame': {
          type: 'string',
        },
        '@orientation': {
          type: ['array', 'null'],
          items: {
            type: 'number',
          },
          minItems: 3,
          maxItems: 10,
        },
        '@context': {
          type: 'string',
        },
        required: ['Node', '@destination', '@frame', '@orientation'],
      },
      visibility: 'public',
      tag: 'v1.0', // グルーピング用のタグ
      create_user: 'user-001',
      create_user_name: 'John Doe',
      create_date: '2024-06-18T12:22:34.024',
      update_user: 'user-002',
      update_user_name: 'Jane Smith',
      update_date: '2024-07-18T15:45:23.123',
      module_skills: [
        {
          module_id: 'mod-1001',
          skill_id: '11111111-1111-1111-1111-111111111111',
        },
      ],
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      organization_id: 'org-1234',
      name: 'Vision Processing',
      description: 'This skill provides vision processing capabilities.',
      schema: {
        type: 'object',
        Node: {
          type: 'string',
          enum: 'VISION_PROCESSING',
        },
        '@destination': {
          type: ['array', 'null'],
          items: {
            type: 'number',
          },
          minItems: 2,
          maxItems: 8,
        },
        '@frame': {
          type: 'string',
        },
        '@orientation': {
          type: ['array', 'null'],
          items: {
            type: 'number',
          },
          minItems: 3,
          maxItems: 8,
        },
        '@context': {
          type: 'string',
        },
        required: ['Node', '@destination', '@frame', '@orientation'],
      },
      visibility: 'private',
      tag: 'v1.0', // グルーピング用のタグ
      create_user: 'user-003',
      create_user_name: 'Alice Johnson',
      create_date: '2024-06-22T10:10:10.010',
      update_user: 'user-004',
      update_user_name: 'Bob Lee',
      update_date: '2024-07-22T11:11:11.111',
      module_skills: [
        {
          module_id: 'mod-2002',
          skill_id: '22222222-2222-2222-2222-222222222222',
        },
      ],
    },

    // v2.0 グループ
    {
      id: '33333333-3333-3333-3333-333333333333',
      organization_id: 'org-5678',
      name: 'Navigation',
      description: 'This skill handles the navigation of the robot in a predefined area.',
      schema: {
        type: 'object',
        Node: {
          type: 'string',
          enum: 'NAVIGATION',
        },
        '@destination': {
          type: ['array', 'null'],
          items: {
            type: 'number',
          },
          minItems: 3,
          maxItems: 20,
        },
        '@frame': {
          type: 'string',
        },
        '@orientation': {
          type: ['array', 'null'],
          items: {
            type: 'number',
          },
          minItems: 3,
          maxItems: 20,
        },
        '@context': {
          type: 'string',
        },
        required: ['Node', '@destination', '@frame', '@orientation'],
      },
      visibility: 'public',
      tag: 'v2.0', // グルーピング用のタグ
      create_user: 'user-005',
      create_user_name: 'Charlie Brown',
      create_date: '2024-08-01T09:00:00.000',
      update_user: 'user-006',
      update_user_name: 'Emily Davis',
      update_date: '2024-08-15T14:30:30.500',
      module_skills: [
        {
          module_id: 'mod-3003',
          skill_id: '33333333-3333-3333-3333-333333333333',
        },
      ],
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      organization_id: 'org-5678',
      name: 'Object Detection',
      description: "This skill detects objects in the robot's environment.",
      schema: {
        type: 'object',
        Node: {
          type: 'string',
          enum: 'OBJECT_DETECTION',
        },
        '@destination': {
          type: ['array', 'null'],
          items: {
            type: 'number',
          },
          minItems: 3,
          maxItems: 15,
        },
        '@frame': {
          type: 'string',
        },
        '@orientation': {
          type: ['array', 'null'],
          items: {
            type: 'number',
          },
          minItems: 3,
          maxItems: 15,
        },
        '@context': {
          type: 'string',
        },
        required: ['Node', '@destination', '@frame', '@orientation'],
      },
      visibility: 'restricted',
      tag: 'v2.0', // グルーピング用のタグ
      create_user: 'user-007',
      create_user_name: 'David Clark',
      create_date: '2024-07-10T11:20:30.400',
      update_user: 'user-008',
      update_user_name: 'Fiona George',
      update_date: '2024-07-25T16:45:50.600',
      module_skills: [
        {
          module_id: 'mod-4004',
          skill_id: '44444444-4444-4444-4444-444444444444',
        },
      ],
    },

    // v3.0 グループ
    {
      id: '55555555-5555-5555-5555-555555555555',
      organization_id: 'org-9876',
      name: 'Object Tracking',
      description: 'This skill tracks moving objects in real-time.',
      schema: {
        type: 'object',
        Node: {
          type: 'string',
          enum: 'OBJECT_TRACKING',
        },
        '@destination': {
          type: ['array', 'null'],
          items: {
            type: 'number',
          },
          minItems: 3,
          maxItems: 10,
        },
        '@frame': {
          type: 'string',
        },
        '@orientation': {
          type: ['array', 'null'],
          items: {
            type: 'number',
          },
          minItems: 3,
          maxItems: 10,
        },
        '@context': {
          type: 'string',
        },
        required: ['Node', '@destination', '@frame', '@orientation'],
      },
      visibility: 'public',
      tag: 'v3.0', // グルーピング用のタグ
      create_user: 'user-009',
      create_user_name: 'Henry Moore',
      create_date: '2024-09-05T12:30:40.700',
      update_user: 'user-010',
      update_user_name: 'Isla Harris',
      update_date: '2024-09-15T15:00:00.000',
      module_skills: [
        {
          module_id: 'mod-5005',
          skill_id: '55555555-5555-5555-5555-555555555555',
        },
      ],
    },
  ],
}
