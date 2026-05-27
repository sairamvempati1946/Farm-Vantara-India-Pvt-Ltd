import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://uzwqduqzitjudlamgjmp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6d3FkdXF6aXRqdWRsYW1nam1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDMwOTgsImV4cCI6MjA5MTcxOTA5OH0.nEakMsbqoFycCQ1PmlJhESLn1VydWhj1NkuLdbarq0g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);