CREATE OR REPLACE FUNCTION subtasks_recursive_flat(parent_gid text, subtask_pursuance_id integer) RETURNS TABLE(gid text, pursuance_id integer, id integer, title text, title_enc text, deliverables text, deliverables_enc text, assigned_to text, due_date timestamp WITH time zone, created timestamp WITH time zone, parent_task_gid text, assigned_to_pursuance_id integer) AS $$
    WITH RECURSIVE parent_task AS (
            SELECT *
            FROM tasks WHERE parent_task_gid IS NOT DISTINCT FROM parent_gid
                         AND pursuance_id IS NOT DISTINCT FROM subtask_pursuance_id
        UNION ALL
            SELECT tasks.*
            FROM tasks, parent_task WHERE tasks.parent_task_gid IS NOT DISTINCT FROM parent_task.gid
                                      AND tasks.pursuance_id IS NOT DISTINCT FROM parent_task.pursuance_id
    )
    SELECT *
    FROM parent_task;
$$ LANGUAGE SQL STABLE;
ALTER FUNCTION subtasks_recursive_flat(parent_gid text, subtask_pursuance_id integer) OWNER TO superuser;
