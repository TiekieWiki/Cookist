export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          colorscheme: Database['public']['Enums']['colorschemes'];
          created_at: string | null;
          email: string | null;
          handedness: Database['public']['Enums']['handednesstypes'];
          id: string;
          language: Database['public']['Enums']['languages'];
        };
        Insert: {
          colorscheme?: Database['public']['Enums']['colorschemes'];
          created_at?: string | null;
          email?: string | null;
          handedness?: Database['public']['Enums']['handednesstypes'];
          id: string;
          language?: Database['public']['Enums']['languages'];
        };
        Update: {
          colorscheme?: Database['public']['Enums']['colorschemes'];
          created_at?: string | null;
          email?: string | null;
          handedness?: Database['public']['Enums']['handednesstypes'];
          id?: string;
          language?: Database['public']['Enums']['languages'];
        };
        Relationships: [];
      };
      recipe_ingredients: {
        Row: {
          amount: number;
          id: string;
          name: string;
          recipe_id: string;
          unit: string;
        };
        Insert: {
          amount: number;
          id?: string;
          name: string;
          recipe_id: string;
          unit: string;
        };
        Update: {
          amount?: number;
          id?: string;
          name?: string;
          recipe_id?: string;
          unit?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'recipe_ingredients_recipe_id_fkey';
            columns: ['recipe_id'];
            isOneToOne: false;
            referencedRelation: 'recipes';
            referencedColumns: ['id'];
          }
        ];
      };
      recipe_instructions: {
        Row: {
          id: string;
          instruction: string;
          recipe_id: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          instruction: string;
          recipe_id: string;
          sort_order: number;
        };
        Update: {
          id?: string;
          instruction?: string;
          recipe_id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'recipe_instructions_recipe_id_fkey';
            columns: ['recipe_id'];
            isOneToOne: false;
            referencedRelation: 'recipes';
            referencedColumns: ['id'];
          }
        ];
      };
      recipe_users: {
        Row: {
          last_eaten: string | null;
          recipe_id: string;
          user_id: string;
        };
        Insert: {
          last_eaten?: string | null;
          recipe_id: string;
          user_id: string;
        };
        Update: {
          last_eaten?: string | null;
          recipe_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'recipe_users_recipe_id_fkey';
            columns: ['recipe_id'];
            isOneToOne: false;
            referencedRelation: 'recipes';
            referencedColumns: ['id'];
          }
        ];
      };
      recipes: {
        Row: {
          category: string;
          duration: number;
          id: string;
          name: string;
          notes: string | null;
          owner: string;
          portions: number;
          rating: number;
        };
        Insert: {
          category: string;
          duration: number;
          id?: string;
          name: string;
          notes?: string | null;
          owner: string;
          portions: number;
          rating: number;
        };
        Update: {
          category?: string;
          duration?: number;
          id?: string;
          name?: string;
          notes?: string | null;
          owner?: string;
          portions?: number;
          rating?: number;
        };
        Relationships: [];
      };
      user_grocerylist: {
        Row: {
          amount: number;
          id: string;
          name: string;
          unit: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          id?: string;
          name: string;
          unit: string;
          user_id?: string;
        };
        Update: {
          amount?: number;
          id?: string;
          name?: string;
          unit?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_recipe: {
        Args: {
          p_category: string;
          p_duration: number;
          p_ingredients: Json;
          p_instructions: Json;
          p_name: string;
          p_notes: string;
          p_portions: number;
          p_rating: number;
        };
        Returns: {
          category: string;
          duration: number;
          id: string;
          name: string;
          notes: string | null;
          owner: string;
          portions: number;
          rating: number;
        };
        SetofOptions: {
          from: '*';
          to: 'recipes';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      get_recipe: { Args: { p_recipe_id: string }; Returns: Json };
      get_recipes: {
        Args: {
          p_category?: string;
          p_duration_max?: number;
          p_duration_min?: number;
          p_ingredients?: string[];
          p_last_eaten_max?: string;
          p_last_eaten_min?: string;
          p_limit?: number;
          p_name?: string;
          p_offset?: number;
          p_order_by?: string;
          p_order_direction?: string;
          p_rating_max?: number;
          p_rating_min?: number;
        };
        Returns: {
          category: string;
          duration: number;
          id: string;
          last_eaten: string;
          name: string;
          notes: string;
          owner: string;
          portions: number;
          rating: number;
        }[];
      };
      get_user_statistics: {
        Args: never;
        Returns: {
          average_rating: number;
          never_cooked: number;
          recipes_created: number;
        }[];
      };
      is_recipe_owner: { Args: { recipe_uuid: string }; Returns: boolean };
      update_recipe: {
        Args: {
          p_category: string;
          p_duration: number;
          p_ingredients: Json;
          p_instructions: Json;
          p_name: string;
          p_notes: string;
          p_portions: number;
          p_rating: number;
          p_recipe_id: string;
        };
        Returns: {
          category: string;
          duration: number;
          id: string;
          name: string;
          notes: string | null;
          owner: string;
          portions: number;
          rating: number;
        };
        SetofOptions: {
          from: '*';
          to: 'recipes';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
    };
    Enums: {
      colorschemes: 'dark' | 'light';
      handednesstypes: 'left' | 'right' | 'ambidextrous';
      languages: 'en' | 'nl';
      recipecategories: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' | 'drink' | 'other';
      recipeunit:
        | 'pc'
        | 'ml'
        | 'dl'
        | 'l'
        | 'tsp'
        | 'tbsp'
        | 'floz'
        | 'cup'
        | 'pt'
        | 'qt'
        | 'gal'
        | 'mg'
        | 'g'
        | 'kg'
        | 'oz'
        | 'lb';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      colorschemes: ['dark', 'light'],
      handednesstypes: ['left', 'right', 'ambidextrous'],
      languages: ['en', 'nl'],
      recipecategories: ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'drink', 'other'],
      recipeunit: [
        'pc',
        'ml',
        'dl',
        'l',
        'tsp',
        'tbsp',
        'floz',
        'cup',
        'pt',
        'qt',
        'gal',
        'mg',
        'g',
        'kg',
        'oz',
        'lb'
      ]
    }
  }
} as const;
